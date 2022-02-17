import style from "../../styles/Profile.module.css";
export const DataInfo: React.FC = () => {
  return (
    <section className={style.dataGrid}>
      <section className={style.dataHeader}>
        <hr />
        <h2>Om dine data</h2>
      </section>
      <section className={style.tax}>
        <h3>Skattefradrag</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id
          dictum lectus, sit amet ultricies metus. Pellentesque condimentum
          tortor commodo, laoreet ex sit amet, auctor nisi. Orci varius natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Phasellus ut risus vel dui vestibulum semper ut ac lorem. Interdum et
          malesuada fames ac ante ipsum primis in faucibus. Ut ultricies magna
          non finibus tincidunt. Aliquam tincidunt accumsan ligula vitae
          faucibus. Duis leo leo, sodales et elit eget, varius rhoncus quam.
          Maecenas porta efficitur lectus non eleifend. Donec eu auctor mauris,
          vitae facilisis augue. Proin maximus, sem at placerat tristique,
          lorem.
        </p>
      </section>
      <section className={style.privacy}>
        <h3>Personvern</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id
          dictum lectus, sit amet ultricies metus. Pellentesque condimentum
          tortor commodo, laoreet ex sit amet, auctor nisi. Orci varius natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Phasellus ut risus vel dui vestibulum semper ut ac lorem. Interdum et
          malesuada fames ac ante ipsum primis in faucibus. Ut ultricies magna
          non finibus tincidunt. Aliquam tincidunt accumsan ligula vitae
          faucibus. Duis leo leo, sodales et elit eget, varius rhoncus quam.
          Maecenas porta efficitur lectus non eleifend. Donec eu auctor mauris,
          vitae facilisis augue. Proin maximus, sem at placerat tristique,
          lorem.
        </p>
      </section>
    </section>
  );
};
