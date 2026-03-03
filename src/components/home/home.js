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
  const [userMissedPoolPayment, setUserMissedPoolPayment] = useState();
  const [userAutopoolPayReciever, setUserAutopoolPayReciever] = useState();
  const [userLevelIncomeReceived, setUserLevelIncomeReceived] = useState();
  const [userIncomeMissed, setUserIncomeMissed] = useState();
  const [copied, setCopied] = useState(false);
  const [isExist, setIsExist] = useState();
  const [regTime, setRegTime] = useState();
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
        Number(web3.utils.fromWei(tokenPriceIs, "ether")).toFixed(2)
      );

      let registTime = await NEW_CBC_ROI.methods.regTime(accounts[0]).call();
      setRegTime(await epochToDate(registTime));

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
      setUserMissedPoolPayment(users.missedPoolPayment);

      let userReceiver = await NEW_CBC_ROI.methods
        .users(users.autopoolPayReciever)
        .call();

      setUserAutopoolPayReciever(userReceiver.id);
      setUserLevelIncomeReceived(users.levelIncomeReceived);
      setUserIncomeMissed(users.incomeMissed);
    }

    load();
  }, []);

  async function epochToDate(epochTime) {
    if (epochTime == undefined || Number(epochTime) <= 0) {
      return "00/00/0000";
    }
    const milliseconds = epochTime * 1000;
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleChange = (event) => {
    setReferrerId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let id = referrerId;
      let amount = web3.utils.toWei(registration_Free, "ether");

      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let USDTTest = new web3.eth.Contract(USDT.ABI, USDT.address);

      let isAllowance = await USDTTest.methods
        .allowance(account, ICU.address)
        .call({ gas: 200000 });

      let reg_user;

      if (isAllowance < amount) {
        setLoading(true);

        await USDTTest.methods
          .approve(ICU.address, amount)
          .send({ from: account })
          .on("receipt", async function () {
            setLoading(false);

            reg_user = await ICU_.methods
              .Registration(id, amount)
              .send({ from: account, value: 0 });

            alert(reg_user.status ? "Registerd Success" : "Registerd Failed !!!!");
          })
          .on("error", function () {
            setLoading(false);
          });
      } else {
        reg_user = await ICU_.methods
          .Registration(id, amount)
          .send({ from: account, value: 0 });

        alert(reg_user.status ? "Registerd Success" : "Registerd Failed !!!!");
      }
    } catch (e) {
      console.log("Error is :", e);
      alert("Error occurred");
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
      <div className="col-sm-12 grid-margin">
        <div className="card">
          <div className="card-body-v1 text-center">
            {/* Write Functionality Is Below */}
            <h5 className="mb-0 address-text">Account Address</h5>
            <h4 className="mb-0 golden-text text-right">
              {account ? account : "0x0000000000000000000000000000000000000000"}
            </h4>
          </div>
        </div>
      </div>
      <div className="row">
        {/* token balance  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Registration Fee</h5>
              <h4 className="mb-0 golden-text">
                {registration_Free ? registration_Free : 0} USDT
              </h4>
            </div>
          </div>
        </div>

        {/* token balance  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Direct Income</h5>
              <h4 className="mb-0 golden-text">
                {registration_Free ? registration_Free / 10 : 0} USDT
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Current User ID</h5>
              <h4 className="mb-0 golden-text">
                {currUserID ? currUserID : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Next Reward</h5>
              <h4 className="mb-0 golden-text">
                {getNextReward ? getNextReward : 0} NVP
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Level Income</h5>
              <h4 className="mb-0 golden-text">
                {level_income ? level_income : 0} USDT
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token Price </h5>
              <h4 className="mb-0 golden-text">
                {tokenPrice ? tokenPrice : 0} USDT
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token Reward </h5>
              <h4 className="mb-0 golden-text">
                {tokenReward ? tokenReward : 0} NVP
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User ID </h5>
              <h4 className="mb-0 golden-text">{userId ? userId : 0} </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Sponsor</h5>
              <h4 className="mb-0 golden-text">
                {userReferrerID ? userReferrerID : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Direct</h5>
              <h4 className="mb-0 golden-text">
                {userReferredUsers ? userReferredUsers : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Income </h5>
              <h4 className="mb-0 golden-text">
                {userIncome ? userIncome : 0} USDT{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Number Of Auto Pool Income</h5>
              <h4 className="mb-0 golden-text">
                {userAutoPoolPayReceived ? userAutoPoolPayReceived : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Missed Pool Payment </h5>
              <h4 className="mb-0 golden-text">
                {userMissedPoolPayment ? userMissedPoolPayment : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Autopool Pay Reciever </h5>
              <h4 className="mb-0 golden-text">
                {userAutopoolPayReciever ? userAutopoolPayReciever : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Number Of Level Income</h5>
              <h4 className="mb-0 golden-text">
                {userLevelIncomeReceived ? userLevelIncomeReceived : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Registration Time </h5>
              <h4 className="mb-0 golden-text">{regTime ? regTime : 0} </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Missed Level Income </h5>
              <h4 className="mb-0 golden-text">
                {userIncomeMissed ? userIncomeMissed : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body text-center">
              Write Functionality Is Below
            </div>
          </div>
        </div>

        {/* incomeMissed user  */}
        <div className="row">
          {!isExist ? (
            <div className="col-sm-12 col-md-6 col-lg-6 grid-margin">
              <div className="card-reg">
                <div className="card-body-reg">
                  <h5>Registration</h5>
                  <div className="row">
                    <div className="col-sm-12 my-auto">
                      <form className="forms-sample" onSubmit={handleSubmit}>
                        <div className="form-group w-100 ">
                          <input
                            className="form-control mt-2"
                            type="number"
                            required
                            name="id"
                            onChange={handleChange}
                            value={referrerId || ""}
                            placeholder="Referral ID"
                          />
                          {/* Loader */}

                          {loading && (
                            <div className="loader-overlay">
                              {" "}
                              Transaction is Approving{" "}
                            </div>
                          )}
                          <input
                            className="btn mt-3 submitbtn_"
                            type="submit"
                            disabled={loading}
                            value="Registration"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-sm-12 col-md-6 col-lg-6 grid-margin">
              <div className="card-reg">
                <div className="card-body-reg">
                  <h5 className="text-center">Copy Referral Link</h5>
                  <div className="row">
                    <div className="col-sm-12 my-auto">
                      <form className="forms-sample" onSubmit={handleCopied}>
                        <div className="form-group w-100">
                          <input
                            className="form-control mt-2"
                            type="text"
                            value={generateReferralLink(currUserID)}
                            readOnly
                          />

                          <button
                            className="btn mt-3 submitbtn_"
                            type="submit"
                            // disabled={copied}
                          >
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
