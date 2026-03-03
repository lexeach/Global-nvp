import React, { useEffect, useState, useCallback } from "react";
import { Buffer } from "buffer";
import Web3 from "web3";
import { ICU, USDT } from "../../utils/web3.js";
import Footer from "../Footer.js";

const Dashboard = () => {
  // Polyfill Buffer for Web3
  if (!window.Buffer) window.Buffer = Buffer;

  const [account, setAccount] = useState("");
  const [registration_Free, setRegistrationFee] = useState(0);
  const [currUserID, setCurrUserID] = useState(0);
  const [getNextReward, setGetNextReward] = useState(0);
  const [level_income, setLevel_income] = useState(0);
  const [tokenReward, setTokenReward] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);

  const [userId, setUserId] = useState(0);
  const [userReferrerID, setUserReferrerID] = useState(0);
  const [userReferredUsers, setUserReferredUsers] = useState(0);
  const [userIncome, setUserIncome] = useState(0);
  const [userAutoPoolPayReceived, setUserAutoPoolPayReceived] = useState(0);
  const [userMissedPoolPayment, setUserMissedPoolPayment] = useState(0);
  const [userAutopoolPayReciever, setUserAutopoolPayReciever] = useState(0);
  const [userLevelIncomeReceived, setUserLevelIncomeReceived] = useState(0);
  const [userIncomeMissed, setUserIncomeMissed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const [rewardWin, setRewardWin] = useState(0);
  const [regTime, setRegTime] = useState("");

  const [referrerId, setReferrerId] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Web3
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const epochToDate = (epochTime) => {
    if (!epochTime || Number(epochTime) <= 0) return "00/00/0000";
    const date = new Date(epochTime * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const loadBlockchainData = useCallback(async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      if (accounts.length === 0) {
        alert("Please connect Metamask");
        return;
      }
      const userAccount = accounts[0];
      setAccount(userAccount);

      const NEW_CBC_ROI = new web3.eth.Contract(ICU.ABI, ICU.address);
      
      // Batching calls or using Promise.all is faster
      const regFee = await NEW_CBC_ROI.methods.REGESTRATION_FESS().call();
      setRegistrationFee(web3.utils.fromWei(regFee, "ether"));

      const currId = await NEW_CBC_ROI.methods.currUserID().call();
      setCurrUserID(currId);

      const nextRew = await NEW_CBC_ROI.methods.getNextReward().call();
      setGetNextReward(Number(web3.utils.fromWei(nextRew, "ether")).toFixed(2));

      const lIncome = await NEW_CBC_ROI.methods.level_income().call();
      setLevel_income(Number(web3.utils.fromWei(lIncome, "ether")).toFixed(2));

      const tPrice = await NEW_CBC_ROI.methods.tokenPrice().call();
      setTokenPrice(Number(web3.utils.fromWei(tPrice, "ether")).toFixed(2));

      const winRew = await NEW_CBC_ROI.methods.rewardWin(userAccount).call();
      setRewardWin(Number(web3.utils.fromWei(winRew, "ether")).toFixed(2));

      const rTime = await NEW_CBC_ROI.methods.regTime(userAccount).call();
      setRegTime(epochToDate(rTime));

      const tReward = await NEW_CBC_ROI.methods.tokenReward().call();
      setTokenReward(Number(web3.utils.fromWei(tReward, "ether")).toFixed(2));

      const userData = await NEW_CBC_ROI.methods.users(userAccount).call();
      setIsExist(userData.isExist);
      setUserId(userData.id);
      setUserReferrerID(userData.referrerID);
      setUserReferredUsers(userData.referredUsers);
      setUserIncome(Number(web3.utils.fromWei(userData.income, "ether")).toFixed(2));
      setUserAutoPoolPayReceived(userData.autoPoolPayReceived);
      setUserMissedPoolPayment(userData.missedPoolPayment);
      
      const poolReceiverData = await NEW_CBC_ROI.methods.users(userData.autopoolPayReciever).call();
      setUserAutopoolPayReciever(poolReceiverData.id);
      setUserLevelIncomeReceived(userData.levelIncomeReceived);
      setUserIncomeMissed(userData.incomeMissed);

    } catch (error) {
      console.error("Error loading blockchain data", error);
    }
  }, [web3]);

  useEffect(() => {
    loadBlockchainData();
    
    // Grab ID from URL once
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) setReferrerId(id);
  }, [loadBlockchainData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const amount = web3.utils.toWei(registration_Free.toString(), "ether");
      const ICU_Contract = new web3.eth.Contract(ICU.ABI, ICU.address);
      const USDT_Contract = new web3.eth.Contract(USDT.ABI, USDT.address);

      const allowance = await USDT_Contract.methods.allowance(account, ICU.address).call();

      if (BigInt(allowance) < BigInt(amount)) {
        await USDT_Contract.methods
          .approve(ICU.address, amount)
          .send({ from: account });
      }

      const reg = await ICU_Contract.methods
        .Registration(referrerId, amount)
        .send({ from: account });

      if (reg.status) {
        alert("Registration Successful");
        loadBlockchainData();
      }
    } catch (e) {
      console.error(e);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = (id) => `${window.location.origin}?id=${id}`;

  const handleCopied = async (e) => {
    e.preventDefault();
    const link = generateReferralLink(currUserID);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="home-container">
      <div className="col-sm-12 grid-margin">
        <div className="card">
          <div className="card-body-v1 text-center">
            <h5 className="mb-0 address-text">Account Address</h5>
            <h4 className="mb-0 golden-text">
              {account || "0x0000000000000000000000000000000000000000"}
            </h4>
          </div>
        </div>
      </div>

      <div className="row">
        {[
          { label: "Registration Fee", value: `${registration_Free} USDT` },
          { label: "Direct Income", value: `${registration_Free / 10} USDT` },
          { label: "Current User ID", value: currUserID },
          { label: "Next Reward", value: `${getNextReward} NVP` },
          { label: "Level Income", value: `${level_income} USDT` },
          { label: "Token Price", value: `${tokenPrice} USDT` },
          { label: "Token Reward", value: `${tokenReward} NVP` },
          { label: "User ID", value: userId },
          { label: "Sponsor", value: userReferrerID },
          { label: "Directs", value: userReferredUsers },
          { label: "Income", value: `${userIncome} USDT` },
          { label: "Auto Pool Count", value: userAutoPoolPayReceived },
          { label: "Reward Win", value: rewardWin },
          { label: "Reg Time", value: regTime },
        ].map((item, idx) => (
          <div key={idx} className="col-lg-4 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>{item.label}</h5>
                <h4 className="mb-0 golden-text">{item.value || 0}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row justify-content-center">
        {!isExist ? (
          <div className="col-md-6 grid-margin">
            <div className="card-reg">
              <div className="card-body-reg">
                <h5>Registration</h5>
                <form onSubmit={handleSubmit}>
                  <input
                    className="form-control mt-2"
                    type="number"
                    required
                    value={referrerId}
                    onChange={(e) => setReferrerId(e.target.value)}
                    placeholder="Referral ID"
                  />
                  <button className="btn mt-3 submitbtn_" type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Register Now"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-md-6 grid-margin">
            <div className="card-reg">
              <div className="card-body-reg text-center">
                <h5>Your Referral Link</h5>
                <input
                  className="form-control mt-2"
                  type="text"
                  value={generateReferralLink(currUserID)}
                  readOnly
                />
                <button className="btn mt-3 submitbtn_" onClick={handleCopied}>
                  {copied ? "Copied!" : "Copy Link"}
                </button>
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
