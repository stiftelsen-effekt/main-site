export const withStaticProps =
  <Context, StaticProps>(getStaticProps: (context: Context) => Promise<StaticProps>) =>
  <Props = {}>(component: React.FC<Props & StaticProps & { children?: React.ReactNode }>) => {
    return Object.assign(component, { getStaticProps });
  };
