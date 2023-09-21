import React, { useEffect, useRef, useState } from "react";

import { Payment, PaymentError } from "@labs/gazin-payment-component";
import "@labs/gazin-payment-component/dist/index.css";
import "./App.css";
import { IPaymentData } from "@labs/gazin-payment-component/dist/types";
import { FieldsError } from "@labs/gazin-payment-component/dist/Payment";
import { IAmount } from "@labs/gazin-payment-component/dist/components/CreditCard/CreditCardForm";

const amount: IAmount = {
  value: 120,
  installments: [
    {
      value: 120,
      number: 1,
      hasInterest: false,
    },
    {
      value: 60,
      number: 2,
      hasInterest: false,
    },
    {
      value: 40,
      number: 3,
      hasInterest: false,
    },
    {
      value: 30,
      number: 4,
      hasInterest: false,
    },
    {
      value: 24,
      number: 5,
      hasInterest: true,
    },
  ],
};

const App = () => {
  const [buttonCustom, setButtonCustom] = useState(false);
  const paymentSubmitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [encryptKey, setEncryptKey] = useState("");
  const [merchantaccount, setMerchantaccount] = useState("");
  const [split, setSplit] = useState(false);
  const [onErrors, setOnErrors] = useState<PaymentError>();
  const [onSuccess, setOnSucess] = useState<IPaymentData>();

  const handleCheckboxChange = () => {
    setButtonCustom(!buttonCustom);

    const paymentSubmitButton = document.querySelector(
      '.payment-container button[type="submit"]'
    ) as HTMLButtonElement;

    if (!buttonCustom && paymentSubmitButton) {
      paymentSubmitButton.style.display = "none";
      paymentSubmitButton.disabled = true;
    } else {
      paymentSubmitButton.style.display = "block";
      paymentSubmitButton.disabled = false;
    }
  };

  const onSubmit = (data: IPaymentData) => {
    console.log("App data", data);
    setOnSucess(data);
  };
  const onError = (error: PaymentError) => {
    console.log("onError: ", error);
    if (encryptKey === "" && merchantaccount === "") {
      setOnErrors(error);
    }
  };

  const fieldsError = (error: FieldsError) => {
    console.log("fieldsError: ", error);
  };

  const handleExternalButtonClick = () => {
    const paymentSubmitButtonRef = document.querySelector(
      '.payment-container button[type="submit"]'
    ) as HTMLButtonElement;

    if (paymentSubmitButtonRef) {
      paymentSubmitButtonRef.disabled = false;
      paymentSubmitButtonRef.click();
    }
    paymentSubmitButtonRef.hidden = true;
  };

  const handleEncryptKeyChange = (event: any) => {
    setEncryptKey(event.target.value);
  };

  const handleMerchantaccountChange = (event: any) => {
    setMerchantaccount(event.target.value);
  };

  const handleSplitChange = (event: any) => {
    setSplit(event.target.checked);
  };

  useEffect(() => {
    paymentSubmitButtonRef.current = document.querySelector(
      '.payment-container button[type="submit"]'
    ) as HTMLButtonElement;

    if (paymentSubmitButtonRef.current) {
      paymentSubmitButtonRef.current.disabled = buttonCustom;
    }

    if (encryptKey !== "" && merchantaccount !== "") {
      setOnErrors(undefined);
    }
  }, [buttonCustom, encryptKey, merchantaccount]);

  return (
    <div className="payment-container">
      <div className="payment-container">
        {onErrors ? <label>Avisos</label> : ""}
        <p style={{ color: "red" }}>
          {" "}
          <p>{onErrors ? onErrors.message : ""}</p>
          <p>{onErrors ? "Verifique o preenchimento dos campos abaixo" : ""}</p>
        </p>

        <br />
        <label>Informe a sua EncryptKey </label>
        <br />
        <input
          type="password"
          value={encryptKey}
          onChange={handleEncryptKeyChange}
        />

        <br />
        <br />
        <label>Informe seu Merchantaccount </label>
        <br />
        <input
          type="text"
          value={merchantaccount}
          onChange={handleMerchantaccountChange}
        />

        <br />
        <br />
        <label>Esta transação é split ? </label>
        <input type="checkbox" checked={split} onChange={handleSplitChange} />

        <br />
        <label>Deseja testar com o botão Customisavel ? </label>
        <input
          type="checkbox"
          checked={buttonCustom}
          onChange={handleCheckboxChange}
        />
      </div>
      <br />
      <br />
      <Payment
        amount={amount}
        environment="production"
        onSubmit={onSubmit}
        onError={onError}
        fieldsError={fieldsError}
        encryptKey={encryptKey}
        merchantaccount={parseInt(merchantaccount)}
        split={split}
        config={{
          paymentTypeTitle: "Cartão de crédito",
          checkoutButtonTitle: "PAGAR COM CARTÃO DE CRÉDITO",
          checkoutButtonVisible: !buttonCustom,
          noSelectIstallmentLabel: "Selecione uma parcela",
        }}
      />
      <div className="divButtonCustom">
        <button
          className="buttonCustom"
          disabled={!buttonCustom}
          onClick={handleExternalButtonClick}
          style={!buttonCustom ? { display: "none" } : {}}
        >
          Finalizar Compra
        </button>
      </div>
      <p>
        {" "}
        {onSuccess ? <label style={{ color: "green" }}>Success</label> : ""}
        <p>{onSuccess ? JSON.stringify(onSuccess) : ""}</p>
      </p>
    </div>
  );
};

export default App;
