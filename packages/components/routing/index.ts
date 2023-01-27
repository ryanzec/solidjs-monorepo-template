import AuthenticatedRoute from '$/components/routing/authenticated-route';
import Routes from '$/components/routing/routes';
import UnauthenticatedRoute from '$/components/routing/unauthenticated-route';

export default Object.assign(Routes, { AuthenticatedRoute, UnauthenticatedRoute });
