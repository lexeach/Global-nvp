import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import Web3 from "web3";
import { ICU, USDT } from "../../utils/web3.js";
import { useParams } from "react-router-dom";
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
  const [rewardWin, setRewardWin] = useState();
  const [regTime, setRegTime] = useState();

  const [referrerId, setReferrerId] = useState();

  const [loading, setLoading] = useState(false);
  // const { idFromUrl } = useParams(); // Assumes you are using React Router

  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      if (!accounts) {
        alert("please install metamask");
      }

      setAccount(accounts[0]);
      console.log("Account is ", account);
      // let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let NEW_CBC_ROI = new web3.eth.Contract(ICU.ABI, ICU.address);
      let RegistrationFee = await NEW_CBC_ROI.methods
        .REGESTRATION_FESS()
        .call();
      console.log("Accounts of zero is :", accounts[0]);

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

      let winRewards = await NEW_CBC_ROI.methods.rewardWin(accounts[0]).call();
      setRewardWin(Number(web3.utils.fromWei(winRewards, "ether")).toFixed(2));

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
      console.log("Its an autopool : ", users.autopoolPayReciever);
      let userReceiver = await NEW_CBC_ROI.methods
        .users(users.autopoolPayReciever)
        .call();
      setUserAutopoolPayReciever(userReceiver.id);
      setUserLevelIncomeReceived(users.levelIncomeReceived);
      setUserIncomeMissed(users.incomeMissed);
    }

    load();
  }, []);

  useEffect(() => {
    const parsedUrl = new URL(window.location.href);
    const id = parsedUrl.searchParams.get("id");
    if (id != undefined) {
      setReferrerId(id);
    }
  });

  async function epochToDate(epochTime) {
    // Convert epoch time to milliseconds (JavaScript uses milliseconds)
    // Convert epoch to milliseconds
    if (epochTime == undefined || Number(epochTime) <= 0) {
      return "00/00/0000";
    }
    const milliseconds = epochTime * 1000;
    console.log("millisecond:", milliseconds);
    // Create a new Date object
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }
  // handle change for registration
  const handleChange = (event) => {
    setReferrerId(event.target.value);
  };

  // registration
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let id = referrerId;
      let amount = web3.utils.toWei(registration_Free, "ether"); // registration_Free; //web3.utils.toWei(amount, "ether")).toFixed(2) / 10000000000000000;
      // console.log("Amount To Wei:", amount);
      // if (id === "0") {
      //   id = "50000";
      // }
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let USDTTest = new web3.eth.Contract(USDT.ABI, USDT.address);
      console.log("Allowance: ", ICU.address, account);
      // let isAllowance = await USDT_.methods
      //   .allowance(account, ICU.address)
      //   .call();
      let isAllowance = await USDTTest.methods
        .allowance(account, ICU.address)
        .call({ gas: 200000 });
      let isApprove, reg_user;
      if (isAllowance < amount) {
        setLoading(true);

        isApprove = await USDTTest.methods
          .approve(ICU.address, amount)
          .send({ from: account })
          .on("receipt", async function (receipt) {
            setLoading(false);

            reg_user = await ICU_.methods
              .Registration(id, amount)
              .send({ from: account, value: 0 });
            console.log("****** native coin accepting condtion", reg_user);
            if (reg_user.status) {
              alert("Registerd Success");
            } else {
              alert("Registerd Failed !!!!");
            }
          })
          .on("error", function (error, receipt) {
            // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            setLoading(false);
          });
      } else {
        reg_user = await ICU_.methods
          .Registration(id, amount)
          .send({ from: account, value: 0 });
        console.log("****** native coin accepting condtion", reg_user);
        if (reg_user.status) {
          alert("Registerd Success");
        } else {
          alert("Registerd Failed !!!!");
        }
      }
    } catch (e) {
      console.log("Error is :", e);
      alert("Error is catched", e);
    }
  };
  const handleSubmitUnfreez = async (event) => {
    event.preventDefault();
    try {
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      await ICU_.methods.unfreezeYourToken().send({ from: account });
    } catch (e) {
      console.log("Error is :", e);
      alert("Error is catched", e);
    }
  };

  const generateReferralLink = (id) => {
    // Implement your logic to generate the referral link based on the provided ID
    return `http://localhost:3000?id=${id}`;
  };
  const copyToClipboard = (text) => {
    // Create a temporary textarea element to copy the text
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };
  const handleCopied = (e) => {
    e.preventDefault();

    // Logic to copy the link
    const referralLink = generateReferralLink(currUserID); // Implement your logic to generate the link
    copyToClipboard(referralLink);

    // Set the copied state to true
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
              <h5>Get Next Reward</h5>
              <h4 className="mb-0 golden-text">
                {getNextReward ? getNextReward : 0} USDT
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
                {tokenReward ? tokenReward : 0} USDT
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
              <h5>User Referrer ID </h5>
              <h4 className="mb-0 golden-text">
                {userReferrerID ? userReferrerID : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Referred Users </h5>
              <h4 className="mb-0 golden-text">
                {userReferredUsers ? userReferredUsers : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Income </h5>
              <h4 className="mb-0 golden-text">
                {userIncome ? userIncome : 0} USDT{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Auto Pool Pay Received </h5>
              <h4 className="mb-0 golden-text">
                {userAutoPoolPayReceived ? userAutoPoolPayReceived : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Missed Pool Payment </h5>
              <h4 className="mb-0 golden-text">
                {userMissedPoolPayment ? userMissedPoolPayment : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Autopool Pay Reciever </h5>
              <h4 className="mb-0 golden-text">
                {userAutopoolPayReciever ? userAutopoolPayReciever : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Level Income Received </h5>
              <h4 className="mb-0 golden-text">
                {userLevelIncomeReceived ? userLevelIncomeReceived : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Reward Win </h5>
              <h4 className="mb-0 golden-text ">
                {rewardWin ? rewardWin : 0}{" "}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Reg Time </h5>
              <h4 className="mb-0 golden-text">{regTime ? regTime : 0} </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Income Missed </h5>
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

          <div className="col-sm-12 col-md-6 col-lg-6 grid-margin">
            <div className="card-reg">
              <div className="card-body-reg">
                <h5>Unfreez Token</h5>
                <div className="row">
                  <div className="col-sm-12 my-auto">
                    <form
                      className="forms-sample"
                      onSubmit={handleSubmitUnfreez}
                    >
                      <div className="form-group w-100">
                        <input
                          className="btn mt-3 submitbtn1 text-center"
                          type="submit"
                          // disabled={loading}
                          value=""
                          style={{
                            backgroundImage: `url(${logoImage})`, // Use the imported image
                            backgroundSize: "cover", // Adjust background size if needed
                            backgroundRepeat: "no-repeat", // Adjust background repeat if needed
                            width: "100px",
                            height: "100px",
                          }}
                        />
                        <input
                          className="btn mt-3 submitbtn1"
                          type="submit"
                          // disabled={loading}
                          value=""
                          style={{
                            backgroundImage: `url(${Logo1})`, // Use the imported image
                            backgroundSize: "cover", // Adjust background size if needed
                            backgroundRepeat: "no-repeat", // Adjust background repeat if needed
                            width: "100px",
                            height: "100px",
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
