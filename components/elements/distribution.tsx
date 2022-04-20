import React from "react";
import { Distribution } from "../../models";
import style from "../../styles/Distribution.module.css";

export const DistributionController: React.FC<{ distribution: Distribution, onChange: (distribtion: Distribution) => void }> = ({ distribution, onChange }) => {
  const sum = distribution.organizations.reduce((acc, curr) => acc + parseFloat(curr.share),0)

  return <div className={style.wrapper}>
    <div className={style.grid}>
      {distribution.organizations.map(org => <div key={org.id} className={style["share-wrapper"]}>
        <span>{org.name}</span>
        <div>
          <input type="text" defaultValue={parseFloat(org.share).toFixed(0)} onChange={(e) => {
            const value = e.target.value
            const index = distribution.organizations.map(dist => dist.id).indexOf(org.id)
            const newDistribution: Distribution = {...distribution}
            newDistribution.organizations[index].share = e.target.value
            onChange(newDistribution)
          }} 
          data-cy="distribution-input"/>
          <span>%</span>
        </div>
      </div>)}
    </div>
    {sum !== 100 ? <div className={style["warning-box"]} data-cy="distribution-warning">Fordeling må summere til 100 <span>{sum} / 100</span></div> : null}
  </div>
}