import { useState, useEffect } from "react";
import "./App.css";
import Modal from "./Modal";
import { numbers, letters, specialCharacters } from "./Characters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [startingPhrase, setStartingPhrase] = useState("");
  const [endingPhrase, setEndingPhrase] = useState("");
  const [includeSpecial, setIncludeSpecial] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [pwdLength, setPwdLength] = useState(12);
  const [output, setOutput] = useState("");
  const [hidePwd, setHidePwd] = useState(false);
  const [maskedPwd, setMaskedPwd] = useState("");
  const [modalStatus, setModalStatus] = useState({
    message: "",
    state: "error",
  });

  let pwdHistory = localStorage.getItem("passwords")
    ? localStorage.getItem("passwords").split(",")
    : [];

  function handleGeneratePwd() {
    if (pwdLength < 12 || pwdLength > 50) {
      setModalStatus({
        message:
          "Password should be atleast 12 characters and atmost 50 characters long",
        state: "error",
      });
      setTimeout(() => {
        setModalStatus({ message: "", state: "error" });
      }, 5000);
      return;
    }
    setHidePwd(false);
    let selectedCharacters = letters;

    if (includeSpecial) {
      selectedCharacters += specialCharacters;
    }
    if (includeNumbers) {
      selectedCharacters += numbers;
    }

    setOutput(generatePwd(selectedCharacters));
  }

  function generatePwd(str) {
    let pwd = "";
    let strLen = str.length;
    let startingPhraseLen = startingPhrase.length;
    let endingPhraseLen = endingPhrase.length;

    for (let i = 0; i < pwdLength; i++) {
      let index = Math.floor(Math.random() * strLen);
      pwd += str.charAt(index);
    }

    pwd = pwd.slice(startingPhraseLen, pwdLength - endingPhraseLen);

    return startingPhrase + pwd + endingPhrase;
  }

  function copyPwd() {
    if (output === "") {
      return;
    }

    let duplicatePwd = false;
    pwdHistory.forEach((pwd) => {
      if (pwd.length === output.length && pwd === output) {
        duplicatePwd = true;
        return;
      }
    });
    if (duplicatePwd) {
      setModalStatus({
        message:
          "This password have been copied once, so it can't be copied again",
        state: "error",
      });
      setTimeout(() => {
        setModalStatus({ message: "", state: "error" });
      }, 5000);
      return;
    }

    navigator.clipboard.writeText(output).then(() => {
      pwdHistory.push(output);
      localStorage.setItem("passwords", pwdHistory);
      setModalStatus({ message: "Copied to clipboard", state: "success" });
      setTimeout(() => {
        setModalStatus({ message: "", state: "error" });
      }, 5000);
    });
  }

  function handlePwdVisibility() {
    let mask = "";
    if (!hidePwd) {
      setHidePwd(true);
      for (let i = 1; i <= pwdLength; i++) {
        mask += "•";
      }
    } else {
      setHidePwd(false);
    }
    setMaskedPwd(mask);
  }

  // Pre-populate output on renders
  useEffect(() => {
    handleGeneratePwd();
  }, []);

  return (
    <>
      <section className="form-box">
        <div className="form-handle">
          <label htmlFor="pwd-length">Password length</label>
          <input
            type="number"
            id="pwd-length"
            min="12"
            max="50"
            defaultValue="12"
            onChange={(e) => setPwdLength(e.target.value)}
          />
        </div>

        <div className="form-handle">
          <label htmlFor="starting-phrase">
            Starting phrase for the password (optional)
          </label>
          <input
            type="text"
            id="starting-phrase"
            name="starting-phrase"
            placeholder="Starting phrase"
            onChange={(e) => setStartingPhrase(e.target.value)}
          />
        </div>

        <div className="form-handle">
          <label htmlFor="ending-phrase">
            Ending phrase for the password (optional)
          </label>
          <input
            type="text"
            id="ending-phrase"
            name="ending-phrase"
            placeholder="Ending phrase"
            onChange={(e) => setEndingPhrase(e.target.value)}
          />
        </div>

        <button type="button" onClick={handleGeneratePwd}>
          Generate password
        </button>
      </section>

      <section>
        <div className="output-container">
          <div className="output-box">
            <span>
              <b>Password</b>
              <FontAwesomeIcon
                icon={faArrowsRotate}
                className="pwd-regenerate"
                onClick={handleGeneratePwd}
              />
            </span>
            <span className="pwd-output">{hidePwd ? maskedPwd : output}</span>
            <FontAwesomeIcon
              icon={faCopy}
              className="pwd-copy"
              onClick={copyPwd}
            />
          </div>

          <p className="pwd-visibility" onClick={handlePwdVisibility}>
            {hidePwd ? "Show" : "Hide"} password
          </p>
        </div>

        <div className="pwd-customisation">
          <div>
            <input
              type="checkbox"
              id="pwd-include-special"
              name="pwd-include-special"
              onChange={(e) => setIncludeSpecial(e.target.checked)}
            />
            <label htmlFor="pwd-include-special">
              Include special characters
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="pwd-include-numbers"
              name="pwd-include-numbers"
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            <label htmlFor="pwd-include-numbers">Include numbers</label>
          </div>
        </div>
      </section>

      <Modal status={modalStatus} />
    </>
  );
};

export default App;
