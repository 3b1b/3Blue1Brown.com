import styles from "./index.module.scss";

const PodcastAnimation = () => {
  return (
    <div className={styles.root}>
      <div className={styles.circleSignal}></div>
      <div className={`${styles.circleSignal} ${styles.stagger1}`}></div>
      <div className={`${styles.circleSignal} ${styles.stagger2}`}></div>
      <svg width="100%" height="100%" viewBox="0 0 1011.2134 1619.4867">
        <g
          transform="translate(-1298.5733,-394.74)"
          style={{
            stroke: "black",
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none",
          }}
        >
          <path d="M 1318.61,1994.19 1792.26,437.116 2289.75,1994.19" />
          <path
            strokeWidth={20}
            d="M 2288.63,1994.19 1492.13,1491.95 2018.91,1191.11 1666.68,905.732 1864.23,719.016 1739.28,593.071"
          />
          <path
            strokeWidth={20}
            d="m 1315.77,1994.19 790.72,-502.24 -524.14,-300.84 345.38,-285.378 -200.6,-186.716 115.54,-125.945"
          />
          <path
            d="m 1754.68,440.566 c 0,-21.167 17.16,-38.326 38.33,-38.326 21.17,0 38.33,17.159 38.33,38.326 0,21.167 -17.16,38.327 -38.33,38.327 -21.17,0 -38.33,-17.16 -38.33,-38.327 z"
            fill="black"
            strokeWidth="15"
          />
        </g>
      </svg>
    </div>
  );
};

export default PodcastAnimation;
