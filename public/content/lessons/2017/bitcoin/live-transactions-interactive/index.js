import { useState, useEffect } from "react";
import styles from "./index.module.scss";

function getInputValue(data) {
  return (
    data.inputs.reduce((sum, input) => input.prev_out.value + sum, 0) /
    100000000
  );
}

function usePeriodicRerender(period = 100) {
  const [, setDummyValue] = useState(true);

  useEffect(() => {
    const rerender = () => setDummyValue((value) => !value);
    const interval = setInterval(rerender, period);
    return () => {
      clearInterval(interval);
    };
  }, [period]);
}

export default function LiveTransactionsInteractive() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (data) => {
    setTransactions((transactions) => {
      const prevTransaction =
        transactions.length > 0 ? transactions[transactions.length - 1] : null;

      // Limit transactions to a rate of one every 200ms. Drop any
      // that come in faster. (This also prevents a bug where switching
      // to a different tab and returning later would display all the
      // transactions that happened in the background all at once.)
      if (prevTransaction && Date.now() - prevTransaction.time < 150) {
        return transactions;
      }

      // Prevent bug where switching to a different tab and returning later
      // displays lots of transactions all at once (by just skipping
      // transactions while the page isn't visible)
      if (document.visibilityState === "hidden") {
        return transactions;
      }

      const prevCorner = prevTransaction ? prevTransaction.corner : 0;

      // Only keep the most recent 30 transactions in memory
      // (This should be enough so that old transactions are
      // only deleted once they have already animated out
      // of existence.)
      return [
        ...transactions.slice(-29),
        {
          data,
          corner: (prevCorner + 1) % 4,
          time: Date.now(),
        },
      ];
    });
  };

  const { error } = useLiveBTCData({
    onTransaction: (data) => {
      addTransaction(data.x);
    },
  });

  const tickerData = useFetchJSON("https://blockchain.info/ticker");

  let largestVisibleTransaction = null;
  for (let i = 0; i < transactions.length; i++) {
    const timeSinceCreation = Date.now() - transactions[i].time;
    if (timeSinceCreation > 5000) continue;
    if (timeSinceCreation < 1500) continue;

    if (largestVisibleTransaction === null) {
      largestVisibleTransaction = transactions[i];
    } else {
      const largestValue = getInputValue(largestVisibleTransaction.data);
      const value = getInputValue(transactions[i].data);
      if (value > largestValue) {
        largestVisibleTransaction = transactions[i];
      }
    }
  }

  const largestTransactionCorner = largestVisibleTransaction
    ? largestVisibleTransaction.corner
    : 2;

  // largestVisibleTransaction changes over time even if state hasn't
  // changed, so we force React to re-render periodically so that
  // it can be updated
  usePeriodicRerender(100);

  if (error) {
    return <ErrorPage />;
  }

  if (!tickerData) {
    return null;
  }

  return (
    <div className={styles.LiveTransactionsInteractive}>
      <PiCreature
        width="200"
        height="auto"
        eyeAngle={(Math.PI * 3) / 4 - (Math.PI / 2) * largestTransactionCorner}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {transactions.map((transaction) => (
        <Transaction
          key={transaction.data.hash}
          data={transaction.data}
          tickerData={tickerData}
          corner={transaction.corner}
        />
      ))}

      <div className={styles.liveIndicator}>
        <span className={styles.liveIndicatorDot} />
        Live
      </div>
    </div>
  );
}

function randomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 50;
  const l = 70;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function Transaction({ data, tickerData, corner }) {
  const inputValue = getInputValue(data);

  const inputValueUSD = inputValue * tickerData.USD["15m"];
  const inputValueUSDString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(inputValueUSD);

  const [outColor] = useState(randomColor());
  const [inColor] = useState(randomColor());

  return (
    <div>
      <a
        className={
          styles.Transaction + " " + styles[`Transaction--corner${corner}`]
        }
        href={`https://www.blockchain.com/btc/tx/${data.hash}`}
        target="_blank"
        rel="noreferrer"
      >
        <div className={styles.Transaction__hash}>
          {(data.hash || "").slice(0, 10)}…{(data.hash || "").slice(-10)}
        </div>
        <div>
          {data.inputs[0].prev_out.addr ? (
            <>
              <span
                className={styles.Transaction__out}
                style={{ color: outColor }}
              >
                {(data.inputs[0].prev_out.addr || "").slice(0, 3)}
                <span>…</span>
                {(data.inputs[0].prev_out.addr || "").slice(-2)}
                {data.inputs.length > 1 && <> (+{data.inputs.length - 1})</>}
              </span>
              {" pays "}
            </>
          ) : (
            "Reward "
          )}
          <span className={styles.Transaction__in} style={{ color: inColor }}>
            {(data.out[0].addr || "").slice(0, 3)}
            <span>…</span>
            {(data.out[0].addr || "").slice(-2)}
            {data.out.length > 1 && <> (+{data.out.length - 1})</>}
          </span>
        </div>
        <div className={styles.Transaction__value}>
          {Math.round(inputValue * 10000) / 10000} BTC ({inputValueUSDString})
        </div>
      </a>

      <TransactionRipple key={data.hash} corner={corner} />
    </div>
  );
}

function TransactionRipple({ corner }) {
  return (
    <div
      className={
        styles.TransactionRipple +
        " " +
        styles[`TransactionRipple--corner${corner}`]
      }
    >
      {new Array(5).fill(null).map((_, n) => (
        <div
          className={styles.TransactionRipple__ripple}
          style={{ animationDelay: `${750 + 200 * n}ms` }}
        />
      ))}
    </div>
  );
}

function PiCreature({ eyeAngle, ...props }) {
  const eyeXShift = 65 * Math.sqrt(2) * (Math.cos(eyeAngle) / 2 - 0.5);
  const eyeYShift = -20 * Math.sqrt(2) * (Math.sin(eyeAngle) / 2 + 0.5);

  return (
    <svg
      width="1402"
      height="1402"
      viewBox="0 0 1402 1402"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M762.06 392.892L762.805 392.884L763.25 392.286C770.156 382.977 774.352 370.981 774.352 358.386C774.352 350.512 772.701 344.414 769.598 339.727C766.49 335.034 762.02 331.899 756.642 329.79C746.002 325.617 731.45 325.34 715.924 325.05V325.049L715.911 325.049C701.803 324.904 687.905 325.172 677.533 329.472C672.297 331.643 667.893 334.864 664.814 339.617C661.739 344.363 660.068 350.508 660.068 358.386C660.068 371.256 664.256 383.876 672.102 393.232L672.558 393.775L673.266 393.768L762.06 392.892Z"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
      <path
        d="M922.706 392.892L923.452 392.884L923.896 392.286C930.803 382.977 934.999 370.981 934.999 358.386C934.999 350.473 933.111 344.257 929.684 339.419C926.262 334.588 921.396 331.258 915.656 328.954C904.254 324.378 889.075 323.735 873.928 323.589L873.921 323.589H873.914C859.792 323.589 846.528 324.224 836.792 328.884C831.872 331.239 827.817 334.634 825.01 339.495C822.211 344.341 820.715 350.533 820.715 358.386C820.715 371.256 824.902 383.876 832.749 393.232L833.204 393.775L833.913 393.768L922.706 392.892Z"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
      <g
        style={{
          transform: `translate(${eyeXShift}px, ${eyeYShift}px)`,
          transition: "transform 300ms ease-in-out",
        }}
      >
        <path
          d="M741.016 354.589C736.635 354.881 733.422 358.971 734.59 363.644C735.174 365.981 737.219 368.025 739.556 368.609C744.813 370.07 749.487 365.396 748.318 359.847C747.734 357.218 745.689 355.173 743.061 354.589C742.476 354.589 741.892 354.589 741.016 354.589L749.487 351.668C763.507 351.668 774.314 364.228 771.685 378.832C769.932 387.595 762.922 394.605 754.16 396.357C739.848 399.278 726.996 388.179 726.996 374.159C726.996 361.599 737.219 351.668 749.487 351.668"
          fill="black"
        />
        <path
          d="M902.536 352.837C898.739 353.129 895.818 356.05 895.818 359.847C895.818 363.644 899.031 366.857 902.828 366.857C906.625 366.857 909.838 363.644 909.838 359.847C909.838 356.05 906.625 352.837 902.828 352.837H902.536L911.006 349.916C923.566 349.916 933.496 360.139 933.496 372.406C933.496 384.674 923.274 394.897 911.006 394.897C898.738 394.897 888.516 384.674 888.516 372.406C888.516 360.139 898.738 349.916 911.006 349.916"
          fill="black"
        />
      </g>
      <path
        d="M705.087 479.309H893.189C848.208 665.658 819.876 787.165 819.876 920.355C819.876 943.721 819.876 1123.35 888.223 1123.35C923.273 1123.35 953.066 1091.81 953.066 1063.48C953.066 1055.3 953.066 1051.79 941.382 1026.97C896.402 912.176 896.402 769.055 896.402 757.372C896.402 747.441 896.402 629.148 931.452 479.601H1030.18C1051.79 479.601 1098.82 517.864 1098.82 464.705C1098.82 428.194 1074.86 389.639 1045.07 389.639H585.333C547.07 389.639 502.673 427.318 498 493.037C494.787 537.725 516.401 581.246 584.457 582.414C650.467 583.582 692.82 563.721 753.573 539.77C764.38 535.389 785.41 498.002 774.895 505.596C730.79 538.31 577.447 541.23 571.897 479.601H666.824C630.314 604.32 588.546 749.194 452.143 1040.4C438.707 1066.98 438.707 1070.49 438.707 1080.42C438.707 1115.47 468.792 1123.64 483.688 1123.64C531.882 1123.64 545.317 1080.42 565.179 1010.61C591.759 925.612 591.759 922.399 608.407 855.804L705.087 479.309Z"
        fill="#0C7F99"
      />
      <path
        d="M713.561 458.863C729.626 458.863 719.11 459.155 752.992 458.863C783.077 458.571 754.161 458.571 763.799 458.279L762.923 449.224C752.116 449.516 770.809 449.808 755.037 449.808C743.646 449.808 730.21 449.808 712.393 449.808"
        fill="black"
      />
    </svg>
  );
}

function useLiveBTCData({ onTransaction }) {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const s = new WebSocket("wss://ws.blockchain.info/inv");

    const connectionTimeout = setTimeout(() => {
      setError(true);
    }, 3000);

    s.addEventListener("open", function (event) {
      clearTimeout(connectionTimeout);
      setSocket(s);
      setError(null);
    });
    s.addEventListener("error", function (event) {
      setError(event);
    });
    return () => {
      s.close();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      if (onTransaction) {
        socket.send(JSON.stringify({ op: "unconfirmed_sub" }));
      } else {
        socket.send(JSON.stringify({ op: "unconfirmed_unsub" }));
      }
    }
  }, [socket, onTransaction]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.op === "utx" && onTransaction) {
          onTransaction(data);
        }
      };
    }
  }, [socket, onTransaction]);

  return { error };
}

function useFetchJSON(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(url, {
      mode: "cors",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setData(data);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return data;
}

function ErrorPage() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "white",
        textAlign: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="150"
        height="150"
        viewBox="0 0 1400 1401"
        style={{
          marginBottom: -24,
        }}
      >
        <path
          d="M676.68 298.337L677.414 298.33L677.859 297.748C685.642 287.563 690.418 274.109 690.418 260.061C690.418 251.62 689.165 245.022 686.456 240.072C683.714 235.062 679.547 231.863 674.017 230.135C668.547 228.425 661.766 228.159 653.714 228.891C645.647 229.625 636.185 231.375 625.302 233.787L625.294 233.788L625.287 233.79C617.177 235.674 609.895 236.853 603.318 237.888C602.911 237.952 602.507 238.015 602.106 238.078C596.033 239.031 590.527 239.896 585.596 241.129C580.322 242.449 575.618 244.21 571.465 247.02C567.299 249.84 563.755 253.669 560.736 259.033L560.728 259.046L560.721 259.06C557.202 265.623 558.323 273.157 561.244 280.089C564.174 287.045 569.027 293.678 573.459 298.705L573.912 299.218L574.597 299.213L676.68 298.337Z"
          fill="white"
          stroke="black"
          stroke-width="3"
        />
        <path
          d="M857.487 299.213L858.237 299.219L858.692 298.623C859.391 297.709 860.165 296.72 860.988 295.669C864.55 291.119 869.01 285.422 872.092 279.708C875.827 272.782 877.99 264.99 872.932 259.085C866.823 251.927 860.303 246.677 850.747 242.418C841.244 238.183 828.776 234.948 810.807 231.732L810.806 231.731C793.61 228.669 776.899 226.92 764.436 230.263C758.157 231.948 752.857 234.949 749.141 239.808C745.426 244.665 743.418 251.217 743.418 259.769C743.418 274.11 748.196 287.607 757.21 297.829L757.652 298.331L758.321 298.337L857.487 299.213Z"
          fill="white"
          stroke="black"
          stroke-width="3"
        />
        <path
          d="M616.876 259.477C612.501 259.769 609.292 263.271 609.292 267.065C609.292 272.319 614.542 276.114 620.084 274.362C622.709 273.487 624.459 271.444 625.042 268.817C625.917 263.855 622.126 259.477 617.167 259.477H616.876L626.501 256.266C640.792 256.266 652.167 267.357 652.167 280.784C652.167 294.502 640.501 305.301 626.501 305.301C612.501 305.301 600.834 294.21 600.834 280.784C600.834 267.065 612.501 256.266 626.501 256.266"
          fill="black"
        />
        <path
          d="M799.751 256.85C795.376 257.142 792.167 260.644 792.167 264.147C792.167 268.233 795.959 271.736 800.042 271.736C804.417 271.736 807.917 268.525 807.917 264.147C807.917 260.061 804.126 256.558 800.042 256.558C800.334 256.85 799.751 256.85 799.751 256.85L809.376 253.931C823.667 253.931 835.042 264.439 835.042 277.573C835.042 290.707 823.376 301.215 809.376 301.215C795.376 301.215 783.709 290.707 783.709 277.573C783.709 264.439 795.376 253.931 809.376 253.931"
          fill="black"
        />
        <path
          d="M613.376 399.869H827.168C775.835 612.938 723.335 749.243 743.46 903.937C746.668 930.206 743.46 1135.98 821.626 1135.98C861.585 1135.98 895.71 1099.79 895.71 1067.39C895.71 1058.05 895.71 1053.96 882.293 1025.65C830.96 894.305 800.335 739.028 800.335 725.601C800.335 714.218 830.96 570.616 871.21 399.577L970.668 399.285C777.876 538.801 869.168 529.169 923.418 494.728C1079.46 395.199 1074.79 295.961 999.835 296.253L475.418 296.837C431.668 296.837 346.793 333.029 369.835 423.511C385.585 485.096 448.876 503.776 491.751 506.987C529.668 509.906 609.585 516.327 620.96 516.327C634.376 516.327 642.251 502.901 628.251 497.939C496.418 450.655 412.71 399.869 459.96 399.869H568.751C527.043 542.596 513.335 826.006 323.46 1041.12C300.71 1066.51 308.001 1075.56 308.001 1086.94C308.001 1126.93 342.418 1136.27 359.335 1136.27C414.46 1136.27 441.876 1083.44 473.085 1006.68C509.835 916.488 524.126 895.764 543.085 819.585L612.21 399.869"
          fill="#0C7F99"
        />
        <path
          d="M664.418 384.107C673.46 373.892 673.46 367.179 690.085 367.179C706.71 367.179 713.418 377.102 726.543 383.816V373.892C719.835 370.681 701.168 353.461 683.376 354.044C669.96 354.336 666.751 367.471 663.543 373.892"
          fill="black"
        />
      </svg>
      <p>Error loading live Bitcoin transactions.</p>
      <p>
        Try viewing the transactions{" "}
        <a
          href="https://www.blockchain.com/btc/unconfirmed-transactions"
          target="_blank"
          rel="noreferrer"
          style={{
            color: "lightblue",
          }}
        >
          here
        </a>{" "}
        instead. (Or reload this page.)
      </p>
    </div>
  );
}
