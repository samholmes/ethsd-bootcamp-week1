import * as React from "react";

function InfoScan({ addressInfo }) {

  return (
    <div className="box transfer">
      <h1>Blockchain Info</h1>

      {addressInfo.map(({ address, balance }) => {
        return (
          <label key={address} className="address-info">
            <div className="address">{address}</div>
            <div className="balance">{balance}</div>
          </label>
        )
      })}
    </div>
  );
}

export default InfoScan;
