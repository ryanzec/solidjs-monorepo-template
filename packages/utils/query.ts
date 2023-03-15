import {
  Accessor,
  batch,
  createReaction,
  createSignal,
  onCleanup,
  Resource,
  ResourceOptions,
  Setter,
  createResource,
} from 'solid-js';

import { CommonDataType } from '$/types/generic';
import { cryptoUtils } from '$/utils/crypto';

type TrackedMutators = Record<string, Setter<CommonDataType>>;
type TrackedRefetchers = Record<string, ResourceRefresher<CommonDataType>>;
type TrackedResources = Record<string, Resource<CommonDataType>>;
type CachedData = Record<
  string,
  {
    expires?: number;
    data?: CommonDataType;
  }
>;
export interface QueryData {
  trackedMutators: TrackedMutators;
  trackedRefetchers: TrackedRefetchers;
  trackedResources: TrackedResources;
  cachedData: CachedData;
}

// global data trackers for query system
const _queryData: QueryData = {
  trackedMutators: {},
  trackedRefetchers: {},
  trackedResources: {},
  cachedData: {},
};

export enum ResourceState {
  UNRESOLVED = 'unresolved',
  PENDING = 'pending',
  READY = 'ready',
  REFRESHING = 'refreshing',
  ERRORED = 'errored',
}

export type MutatorFunction<TMutateInput, TMutateReturn> = (info: TMutateInput) => Promise<TMutateReturn>;

export enum MutationState {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type CreateMutationReturns<TMutateInput, TMutateResult> = {
  mutate: (input: TMutateInput) => Promise<void>;
  state: Accessor<MutationState>;
  result: Accessor<TMutateResult | undefined>;
};

export interface CreateMutationOptions<TMutationInput, TMutationResult> {
  onSuccess?: (mutateResponse: TMutationResult) => Promise<void> | void;
  onMutate?: (mutateInput: TMutationInput) => Promise<void> | void;
  onError?: (mutateInput: TMutationInput, error: unknown) => Promise<boolean | void> | boolean | void;
}

export type QueryCacheKey = [string] | [string, () => CommonDataType];

export const buildDataCacheKey = (primaryKey: string, secondaryKey?: () => CommonDataType) => {
  if (secondaryKey) {
    return `${primaryKey}:${cryptoUtils.hashData(secondaryKey())}`;
  }

  return primaryKey;
};

// returning this as an array, which is desired to allow for easier renaming of returned values, seems to require
// an explicit return type instead of just inferring it
export const createMutation = <TMutateInput, TMutateResult>(
  mutator: MutatorFunction<TMutateInput, TMutateResult>,
  options: CreateMutationOptions<TMutateInput, TMutateResult> = {},
): CreateMutationReturns<TMutateInput, TMutateResult> => {
  const [state, setState] = createSignal<MutationState>(MutationState.IDLE);
  const [result, setResult] = createSignal<TMutateResult>();

  const mutate = async (input: TMutateInput) => {
    setState(MutationState.PROCESSING);

    await options.onMutate?.(input);

    try {
      const response = await mutator(input);

      batch(() => {
        // not sure why but need this case to make sure typescript does not complain
        setResult(response as Exclude<TMutateResult, Function>);
        setState(MutationState.SUCCESS);
      });

      await options.onSuccess?.(response);

      setState(MutationState.IDLE);
    } catch (error) {
      setState(MutationState.ERROR);

      let rethrowError = true;

      if (options.onError) {
        const onErrorResult = await options.onError(input, error);

        rethrowError = onErrorResult !== false;
      }

      if (rethrowError) {
        throw error;
      }

      setState(MutationState.IDLE);
    }
  };

  return { mutate, state, result };
};

export const addTrackedMutator = (queryData: QueryData, key: string, setter: Setter<CommonDataType>) => {
  if (queryData.trackedMutators[key]) {
    return;
  }

  queryData.trackedMutators[key] = setter;
};

export const removeTrackedMutator = (queryData: QueryData, key: string) => {
  delete queryData.trackedMutators[key];
};

export type TriggerMutateMutator<TData> = (oldValue: TData) => TData;

export const triggerMutator = <TData>(queryData: QueryData, key: string, callback: TriggerMutateMutator<TData>) => {
  if (!queryData.trackedMutators[key]) {
    return;
  }

  queryData.trackedMutators[key](callback);

  // not sure how to better handle this without the cast as the cached data is a common pool and can't be typed
  // to a specific resource data type
  setCachedData(queryData, key, getTrackedResource(queryData, key)?.() as CommonDataType);
};

export type ResourceRefresher<TResource> = (info?: unknown) => TResource | Promise<TResource> | undefined | null;

export const addTrackedRefetcher = <TResource>(
  queryData: QueryData,
  key: string,
  setter: ResourceRefresher<TResource>,
) => {
  if (queryData.trackedRefetchers[key]) {
    return;
  }

  // not sure how to better handle this without the cast as the the data of the resource is is a common pool and
  // can't be typed to a specific resource data type
  queryData.trackedRefetchers[key] = setter as ResourceRefresher<CommonDataType>;
};

export const removeTrackedRefetcher = (queryData: QueryData, key: string) => {
  delete queryData.trackedRefetchers[key];
};

interface TriggerRefetcherOptions {
  info?: unknown;
  secondaryKey?: () => CommonDataType;
}

export const triggerRefetcher = async (queryData: QueryData, key: string, options: TriggerRefetcherOptions = {}) => {
  if (!queryData.trackedRefetchers[key]) {
    return;
  }

  const cachedData = getCachedData(queryData, buildDataCacheKey(key, options.secondaryKey));

  if (cachedData && queryData.trackedMutators[key]) {
    // use the mutator to set the resource value to want was found in cache
    triggerMutator(queryData, key, () => cachedData.data);

    return;
  }

  return await queryData.trackedRefetchers[key](options.info);
};

export const setCachedData = (queryData: QueryData, key: string, data: CommonDataType, timeToLive?: number) => {
  if (!queryData.cachedData[key]) {
    queryData.cachedData[key] = {};
  }

  queryData.cachedData[key].data = data;

  if (timeToLive) {
    const currentTime = new Date().getTime();

    queryData.cachedData[key].expires = currentTime + timeToLive;
  }
};

export const removeCachedData = (queryData: QueryData, key: string) => {
  delete queryData.cachedData[key];
};

export const getCachedData = (queryData: QueryData, key: string) => {
  const currentTime = new Date().getTime();

  // @todo (fix) investigate why we need ! here

  if (
    !queryData.cachedData[key] ||
    !queryData.cachedData[key].expires ||
    // for some reason even with the cachedData[key].expires check, TypeScript still complains about
    // cachedData[key].expires might being undefined so using the ! since the code does work
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryData.cachedData[key].expires! < currentTime
  ) {
    removeCachedData(queryData, key);

    return;
  }

  return queryData.cachedData[key];
};

export const addTrackedResource = <TResource>(queryData: QueryData, key: string, resource: Resource<TResource>) => {
  if (queryData.trackedResources[key]) {
    return;
  }

  // not sure how to handle this better without casting since the collection of resource are a general pool and
  // can't be tied to a specific resource type
  queryData.trackedResources[key] = resource as Resource<CommonDataType>;
};

export const removeTrackedResource = (queryData: QueryData, key: string) => {
  delete queryData.trackedResources[key];
};

export const getTrackedResource = (queryData: QueryData, key: string) => {
  if (!queryData.trackedResources[key]) {
    return;
  }

  return queryData.trackedResources[key];
};

export type CreateTrackedQueryReturns<TResource> = [
  Resource<TResource>,
  ResourceRefresher<TResource>,
  (callback: TriggerMutateMutator<TResource>) => void,
];

export interface CreateTrackedQueryOptions {
  cacheTime: number;
}

const createTrackedQueryOptionDefaults: CreateTrackedQueryOptions = {
  cacheTime: 0,
};

export const createTrackedQuery = <TResource>(
  queryData: QueryData,
  queryKey: () => QueryCacheKey,
  getResource: (_: boolean, info: unknown) => TResource | Promise<TResource>,
  overrideOptions: Partial<CreateTrackedQueryOptions> = {},
): CreateTrackedQueryReturns<TResource | undefined> => {
  const [primaryKey, secondaryKey] = queryKey();
  const options: CreateTrackedQueryOptions = Object.assign({}, createTrackedQueryOptionDefaults, overrideOptions);
  const cachedData = getCachedData(queryData, primaryKey);
  // we don't use the setter as if we have cached data, we never need to do the initial request
  const [shouldFetch] = createSignal(!cachedData?.data);
  const resourceInfo: ResourceOptions<TResource> = {};

  if (cachedData?.data) {
    // not sure how to better handle this without the cast as the cached data is a common pool and can't be typed
    // to a specific resource data type
    resourceInfo.initialValue = cachedData.data as TResource;
  }

  const [resource, { refetch, mutate }] = createResource(shouldFetch, getResource, resourceInfo ?? {});

  const trackForCachingData = createReaction(() => {
    trackForCachingData(() => resource.state);

    if (resource.state !== ResourceState.READY) {
      return;
    }

    const dataCacheKey = buildDataCacheKey(primaryKey, secondaryKey);

    // not sure how to better handle this without the cast as the cached data is a common pool and can't be typed
    // to a specific resource data type
    setCachedData(queryData, dataCacheKey, resource() as CommonDataType, options.cacheTime);
  });

  // we only want the cache data effect to run when the state changes, other changes to the resource are not important
  trackForCachingData(() => resource.state);

  addTrackedMutator(queryData, primaryKey, mutate);
  addTrackedRefetcher(queryData, primaryKey, refetch);
  addTrackedResource(queryData, primaryKey, resource);

  onCleanup(() => {
    removeTrackedMutator(queryData, primaryKey);
    removeTrackedRefetcher(queryData, primaryKey);
    removeTrackedResource(queryData, primaryKey);
  });

  return [
    resource,
    async (info?: unknown) => {
      // not sure how to better handle this without the cast as the refetcher data is a common pool and can't be typed
      // to a specific resource data type
      return (await triggerRefetcher(queryData, primaryKey, { info, secondaryKey })) as Promise<TResource | undefined>;
    },
    (callback: TriggerMutateMutator<TResource | undefined>) => {
      triggerMutator(queryData, primaryKey, callback);
    },
  ];
};

export const queryUtils = {
  createMutation,
  createTrackedQuery: <TResource>(
    queryKey: () => QueryCacheKey,
    getResource: (_: boolean, info: unknown) => TResource | Promise<TResource>,
    overrideOptions: Partial<CreateTrackedQueryOptions> = {},
  ) => createTrackedQuery(_queryData, queryKey, getResource, overrideOptions),
  triggerMutator: <TData>(key: string, callback: TriggerMutateMutator<TData>) =>
    triggerMutator(_queryData, key, callback),
  triggerRefetcher: (key: string, options: TriggerRefetcherOptions = {}) => triggerRefetcher(_queryData, key, options),
};
