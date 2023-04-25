export const withStaticProps =
  <Context, StaticProps>(getStaticProps: (context: Context) => Promise<StaticProps>) =>
  <Props = {}>(component: React.FC<Props & StaticProps>) => {
    return Object.assign(component, { getStaticProps });
  };
