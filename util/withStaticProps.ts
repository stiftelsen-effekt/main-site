export const withStaticProps =
  <Context, StaticProps>(getStaticProps: (context: Context) => Promise<StaticProps>) =>
  <Props = {}>(
    component: React.FC<Props & StaticProps>,
  ): React.FC<Props & StaticProps> & {
    getStaticProps: (context: Context) => Promise<StaticProps>;
  } => {
    return Object.assign(component, { getStaticProps });
  };
