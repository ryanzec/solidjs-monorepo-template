declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      // solid-dnd directives
      sortable: boolean;
      droppable: boolean;

      // felte directives
      form: boolean;
    }
  }
}

export {};
