"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { ethers, parseEther, parseUnits} from 'ethers'; // 导入 ethers 库
import {ABI, ContractAddress} from '@/constant/abi'

const WithdrawETH = () => {

  const [amount, setAmount] = useState(''); // 添加状态以存储输入的 ETH 数量
  const [amountERC20, setAmountERC20] = useState(''); // 添加状态以存储输入的 ERC-20 代币数量
  const [result, setResult] = useState(''); // 添加状态以存储输入的 ETH 数量
  const [resultERC20, setResultERC20] = useState(''); // 添加状态以存储输入的 ERC-20 代币数量
  const [withdrawAddress, setWithdrawAddress] = useState(''); // 添加状态以存储提取地址
  const [withdrawManager, setWithdrawManager] = useState(''); // 添加状态以存储提取管理者
    //获取钱包地址 输入框默认填充钱包地址
  // 获取钱包地址
  const getWalletAddress = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWithdrawAddress(accounts[0]); // 设置钱包地址
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
  };

  // 在组件挂载时获取钱包地址
  useEffect(() => {
    getWalletAddress();
  }, []);
  
  //设置取钱管理者
  const WithdrawManager = async () => {
    if (!withdrawAddress) return; // 检查输入是否为空
    console.log('start')
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = ContractAddress; // 替换为你的合约地址
      const contractABI = ABI; // 替换为你的合约 ABI

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.setWithdrawManager(withdrawAddress,{gasLimit: 210000});
      await tx.wait(); // 等待交易确认
      console.log("Withdraw successful:", tx);
      setWithdrawManager('setWithdrawManager successful');
    } catch (error) {
      setWithdrawManager('setWithdrawManager failed');
      console.error("Error withdrawing ERC-20:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!amount) return; // 检查输入是否为空
    console.log('start')
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = ContractAddress; // 替换为你的合约地址
      const contractABI = ABI; // 替换为你的合约 ABI

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.withdrawETH(withdrawAddress, parseEther(amount), {gasLimit: 210000}); 
      await tx.wait(); // 等待交易确认
      console.log("Withdraw successful:", tx);
      setResult('Withdraw successful');
    } catch (error) {
      setResult('Withdraw failed');
        console.error("Error withdrawing ETH:", error);
    }
  };

  const handleWithdrawERC20 = async () => {
    if (!amount) return; // 检查输入是否为空
    console.log('start')
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = ContractAddress; // 替换为你的合约地址
      const contractABI = ABI; // 替换为你的合约 ABI
      const tokenAddress = '0x87350147a24099Bf1e7E677576f01C1415857C75'; // 替换为你的usdt代币地址

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.withdrawERC20(tokenAddress, withdrawAddress, parseUnits(amountERC20.toString(), 18),{gasLimit: 210000});
      await tx.wait(); // 等待交易确认
      console.log("Withdraw successful:", tx);
      setResultERC20('Withdraw successful');
    } catch (error) {
      setResultERC20('Withdraw failed');
      console.error("Error withdrawing ERC-20:", error);
    }
  };


  return (
    <div>
      <h1>2 取出ETH 和 ERC-20代币</h1>
      <Input placeholder='请输入取出的eth地址' value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} />
      <Button onClick={WithdrawManager}>设置取钱管理者</Button> {/* 绑定存钱函数 */}
      <Input 
        placeholder='请输入取出的eth数量' 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} // 更新输入状态
      />
      <Button onClick={handleWithdraw}>取ETH</Button> {/* 绑定存钱函数 */}
      <Input 
        placeholder='请输入取出的ERC-20代币数量' 
        value={amountERC20} 
        onChange={(e) => setAmountERC20(e.target.value)} // 更新输入状态
      />
      <Button onClick={handleWithdrawERC20}>取ERC-20代币</Button> {/* 绑定存钱函数 */}
      {/* 展示合约返回的结果 */}
      {result && (
        <div className="mt-4">
          <h2>取出的结果:</h2>
          <p>{result}</p>
        </div>
      )}
      {resultERC20 && (
        <div className="mt-4">
          <h2>取出ERC-20代币的结果:</h2>
          <p>{resultERC20}</p>
        </div>
      )}
      {withdrawManager && (
        <div className="mt-4">
          <h2>设置取钱管理者的结果:</h2>
          <p>{withdrawManager}</p>
        </div>
      )}
    </div>
  )
}

export default WithdrawETH