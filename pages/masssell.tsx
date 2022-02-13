import React, { CSSProperties } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { useCSVReader } from "react-papaparse";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/TicketMarket.sol/TicketMarket.json";

let resultsMain = [];
const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  } as CSSProperties,
  browseFile: {
    width: "20%",
  } as CSSProperties,
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: "red",
  } as CSSProperties,
};

export default function MassSell() {
  const { CSVReader } = useCSVReader();
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    description: "",
    eventType: "",
    stadium: "",
  });
  const router = useRouter();
  let description;
  let price;
  let eventType;
  let stadium;

  async function createMarket(i) {
    // const { description, price, eventType, stadium } = resultsMain.data[1];
    let description = resultsMain.data[i][0];
    let price = resultsMain.data[i][1];
    let eventType = resultsMain.data[i][2];
    let stadium = resultsMain.data[i][3];

    if (
      !price ||
      !description ||
      !eventType.match(/^[0-9]+$/) ||
      !stadium.match(/^[0-9]+$/)
    )
      return;
    /* first, upload to IPFS */

    const data = JSON.stringify({
      description,
      eventType,
      stadium,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url, price);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url, price1) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(price1, "ether");

    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingFee();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, price, tokenId, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("/");
  }

  function print123() {
    if (resultsMain.length != 0) {
      for (let i = 1; i < resultsMain.data.length; i++) {
        createMarket(i);
      }
    } else {
      console.log("No data");
    }
  }
  return (
    <div>
      <CSVReader
        onUploadAccepted={(results: any) => {
          console.log("---------------------------");
          console.log(results);
          resultsMain = results;
          console.log("---------------------------");
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => (
          <>
            <div style={styles.csvReader}>
              <button
                type="button"
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
                {...getRootProps()}
                style={styles.browseFile}
              >
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              <button
                className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent"
                {...getRemoveFileProps()}
                style={styles.remove}
              >
                Remove
              </button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      <button
        onClick={print123}
        className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
      >
        Mass Sell
      </button>
    </div>
  );
}
