import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/TicketMarket.sol/TicketMarket.json";

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    description: "",
    eventType: "",
    stadium: "",
  });
  const router = useRouter();

  async function createMarket() {
    const { description, price, eventType, stadium } = formInput;
    if (!price || !description || !eventType.match(/^[0-9]+$/) || !stadium.match(/^[0-9]+$/)) return;
    /* first, upload to IPFS */
    console.log("Yes")
    const data = JSON.stringify({
      description,
      eventType,
      stadium,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
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

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingFee();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, price, tokenId, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <textarea
          placeholder="Asset Description"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <div class="flex justify-center">
          <div class="w-full flex flex-col pb-2">
            <select class="mt-2 border rounded p-4 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            onChange={e => updateFormInput({ ...formInput, eventType: e.target.value })}>
              <option selected>Event type</option>
              <option value="1">Sports</option>
              <option value="2">Movie</option>
              <option value="3">Leisure</option>
            </select>
          </div>
        </div>

        <div class="flex justify-center">
          <div class="w-full flex flex-col pb-12">
            <select class="border rounded p-4 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            onChange={e => updateFormInput({ ...formInput, stadium: e.target.value })}>
              <option selected>Select Stadium</option>
              <option value="1">JN Stadium</option>
              <option value="2">Arun Jaitley Stadium</option>
            </select>
          </div>
        </div>

        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  );
}