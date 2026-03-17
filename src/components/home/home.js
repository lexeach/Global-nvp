import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import Web3 from "web3";
import { ICU, USDT } from "../../utils/web3.js";
import logoImage from "./../../assets/images/logo.png";
import Footer from "../Footer.js";
import Logo1 from "./../../assets/images/logo-v1.png";
import Flowbite from "../Flowbit.js";

const Dashboard = () => {
  window.Buffer = Buffer;

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const [account, setAccount] = useState();
  const [registration_Free, setRegistrationFee] = useState();
  const [currUserID, setCurrUserID] = useState();
  const [getNextReward, setGetNextReward] = useState();
  const [level_income, setLevel_income] = useState();
  const [tokenReward, setTokenReward] = useState();
  const [tokenPrice, setTokenPrice] = useState();

  const [userId, setUserId] = useState();
  const [userReferrerID, setUserReferrerID] = useState();
  const [userReferredUsers, setUserReferredUsers] = useState();
  const [userIncome, setUserIncome] = useState();
  const [userAutoPoolPayReceived, setUserAutoPoolPayReceived] = useState();
  const [userAutopoolPayReciever, setUserAutopoolPayReciever] = useState();
  const [userLevelIncomeReceived, setUserLevelIncomeReceived] = useState();
  const [copied, setCopied] = useState(false);
  const [isExist, setIsExist] = useState();
  const [referrerId, setReferrerId] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      if (!accounts) {
        alert("please install metamask");
      }

      setAccount(accounts[0]);

      let NEW_CBC_ROI = new web3.eth.Contract(ICU.ABI, ICU.address);

      let RegistrationFee = await NEW_CBC_ROI.methods.REGESTRATION_FESS().call();
      const convert_regfee = Number(
        web3.utils.fromWei(RegistrationFee, "ether")
      ).toFixed(2);
      setRegistrationFee(convert_regfee);

      let currUserId = await NEW_CBC_ROI.methods.currUserID().call();
      setCurrUserID(currUserId);

      let nextRewared = await NEW_CBC_ROI.methods.getNextReward().call();
      setGetNextReward(
        Number(web3.utils.fromWei(nextRewared, "ether")).toFixed(2)
      );

      let levelIncome = await NEW_CBC_ROI.methods.level_income().call();
      setLevel_income(
        Number(web3.utils.fromWei(levelIncome, "ether")).toFixed(2)
      );

      let tokenPriceIs = await NEW_CBC_ROI.methods.tokenPrice().call();
      setTokenPrice(
        Number(web3.utils.fromWei(tokenPriceIs, "ether")).toFixed(4)
      );

      let tokenRewardIs = await NEW_CBC_ROI.methods.tokenReward().call();
      setTokenReward(
        Number(web3.utils.fromWei(tokenRewardIs, "ether")).toFixed(2)
      );

      let users = await NEW_CBC_ROI.methods.users(accounts[0]).call();

      setIsExist(users.isExist);
      setUserId(users.id);
      setUserReferrerID(users.referrerID);
      setUserReferredUsers(users.referredUsers);
      setUserIncome(
        Number(web3.utils.fromWei(users.income, "ether")).toFixed(2)
      );
      setUserAutoPoolPayReceived(users.autoPoolPayReceived);

      let userReceiver = await NEW_CBC_ROI.methods
        .users(users.autopoolPayReciever)
        .call();

      setUserAutopoolPayReciever(userReceiver.id);
      setUserLevelIncomeReceived(users.levelIncomeReceived);
    }

    load();
  }, []);

  const handleChange = (event) => {
    setReferrerId(event.target.value);
  };

  /* ===========================
     FIXED REGISTRATION FUNCTION
     =========================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!account) {
        alert("Wallet not connected");
        return;
      }

      if (!referrerId) {
        alert("Please enter Referral ID");
        return;
      }

      setLoading(true);

      const ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      const USDTTest = new web3.eth.Contract(USDT.ABI, USDT.address);

      const amount = web3.utils.toWei(registration_Free.toString(), "ether");

      const allowance = await USDTTest.methods
        .allowance(account, ICU.address)
        .call();

      // approve if allowance insufficient
      if (web3.utils.toBN(allowance).lt(web3.utils.toBN(amount))) {
        await USDTTest.methods
          .approve(ICU.address, amount)
          .send({ from: account });
      }

      const reg_user = await ICU_.methods
        .Registration(Number(referrerId), amount)
        .send({ from: account });

      setLoading(false);

      if (reg_user.status) {
        alert("Registered Successfully");
        window.location.reload();
      } else {
        alert("Registration Failed");
      }

    } catch (e) {
      console.log("Error is :", e);
      setLoading(false);
      alert(e?.message || "Error occurred");
    }
  };

  const generateReferralLink = (id) => {
    return `http://localhost:3000?id=${id}`;
  };

  const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleCopied = (e) => {
    e.preventDefault();
    const referralLink = generateReferralLink(currUserID);
    copyToClipboard(referralLink);
    setCopied(true);
  };

  return (
    <div className="home-container">

      {/* ACCOUNT ADDRESS */}
      <div className="col-sm-12 grid-margin">
        <div className="card">
          <div className="card-body-v1 text-center">
            <h5 className="mb-0 address-text">Account Address</h5>
            <h4 className="mb-0 golden-text text-right">
              {account ? account : "0x0000000000000000000000000000000000000000"}
            </h4>
          </div>
        </div>
      </div>

      {/* REGISTRATION SECTION */}

      <div className="row justify-content-center">

        {!isExist ? (
          <div className="col-sm-12 col-md-6 col-lg-5 grid-margin">
            <div className="card-reg">
              <div className="card-body-reg">

                <h5 className="text-center">Registration</h5>

                <form className="forms-sample" onSubmit={handleSubmit}>

                  <input
                    className="form-control mt-2"
                    type="number"
                    required
                    name="id"
                    onChange={handleChange}
                    value={referrerId || ""}
                    placeholder="Referral ID"
                  />

                  {loading && (
                    <div className="loader-overlay">
                      Transaction Processing...
                    </div>
                  )}

                  <input
                    className="btn mt-3 submitbtn_ w-100"
                    type="submit"
                    disabled={loading}
                    value="Registration"
                  />

                </form>

              </div>
            </div>
          </div>

        ) : (

          <div className="col-sm-12 col-md-6 col-lg-5 grid-margin">
            <div className="card-reg">
              <div className="card-body-reg">

                <h5 className="text-center">Copy Referral Link</h5>

                <form className="forms-sample" onSubmit={handleCopied}>

                  <input
                    className="form-control mt-2"
                    type="text"
                    value={generateReferralLink(currUserID)}
                    readOnly
                  />

                  <button className="btn mt-3 submitbtn_ w-100" type="submit">
                    {copied ? "Copied!" : "Copy"}
                  </button>

                </form>

              </div>
            </div>
          </div>

        )}

      </div>

      <Footer />

    </div>
  );
};

export default Dashboard;
