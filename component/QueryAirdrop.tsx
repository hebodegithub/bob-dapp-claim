"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from 'react'
import { useEffect, useState } from "react"
import { ethers } from 'ethers'; // 导入 ethers.js
import { ABI, ContractAddress } from '@/constant/abi'

const formSchema = z.object({
  username: z.string().min(10, {
    message: "Must be ether address.",
  }),
})

const QueryAirdrop = () => {

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null); // 用于存储合约返回的结果
  const [amount, setAmount] = useState<number | null>(null); // 用于存储空投数量
  const [claimAllTokensResult, setClaimAllTokensResult] = useState<string | null>(null); // 用于存储空投数量

  //获取钱包地址 输入框默认填充钱包地址
  // 获取钱包地址
  const getWalletAddress = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]); // 设置钱包地址
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: walletAddress || "", // 默认填充钱包地址
    },
  })

  // 更新表单值
  useEffect(() => {
    if (walletAddress) {
      form.setValue("username", walletAddress); // 更新输入框的值为钱包地址
    }
  }, [walletAddress, form]);


  // 2. 查询空投
  async function queryReward(values: z.infer<typeof formSchema>) {
    // 合约地址和 ABI
    const contractAddress = ContractAddress;
    const contractABI = ABI;

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      try {
        // 假设合约有一个查询函数
        const amount = await contract.queryReward(values.username);
        setAmount(amount);
      } catch (error) {
        setAmount(null);
        console.error("Error querying airdrop amount:", error);
      }
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
  }
  // 2. 领取空投
  async function claimAirdrop(values: z.infer<typeof formSchema>) {
    console.log(values);

    // 合约地址和 ABI
    const contractAddress = ContractAddress; // 替换为您的合约地址
    const contractABI = ABI;

    // 创建以太坊提供者和合约实例
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // 获取签名者
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      try {
        // 估算 gas
        // const gasEstimate = await contract.estimateGas.claim();
        // console.log("Estimated gas:", gasEstimate.toString());
        // 调用合约的 claim 函数
        const tx = await contract.claimToken({ gasLimit: 210000 });
        console.log("Transaction sent:", tx);
        // 等待交易确认
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        // 假设合约返回一个字符串作为结果
        const result = await contract.claimToken(); // 重新调用以获取返回值
        setResult(result); // 更新状态以存储返回值
      } catch (error) {
        setResult('Error calling contract');
        console.error("Error calling contract:", error);
      }
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
  }
  // 2. 领取所有空投代币
  async function claimAllTokens(values: z.infer<typeof formSchema>) {
    // 合约地址和 ABI
    const contractAddress = ContractAddress;
    const contractABI = ABI;

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      try {
        // 假设合约有一个查询函数
        const claimAllTokensResult = await contract.claimAllTokens();
        setClaimAllTokensResult(claimAllTokensResult);
      } catch (error) {
        setClaimAllTokensResult('claim all tokens failed');
        console.error("Error querying airdrop amount:", error);
      }
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
  }


  return (
    <div>
      <Form {...form}>
        <form className="space-y-8">
          <div className="mb-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1 空投代币数量查询</FormLabel>
                  <FormControl>
                    <Input placeholder="0xaddress" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4 flex-row justify-between items-center mt-8">
            <Button type="button" onClick={() => form.handleSubmit(queryReward)()}>查询</Button>
            <Button type="button" onClick={() => form.handleSubmit(claimAirdrop)()}>领取</Button>
            <Button type="button" onClick={() => form.handleSubmit(claimAllTokens)()}>领取所有代币</Button>
          </div>
        </form>
      </Form>
      {/* 展示合约返回的结果 */}
      {result && (
        <div className="mt-4">
          <h2>查询空投的结果:</h2>
          <p>{result}</p>
        </div>
      )}

      {amount && (
        <div className="mt-10">
          <h1>查询空投的数量:</h1>
          <p>{amount}</p>
        </div>
      )}

      {claimAllTokensResult && (
        <div className="mt-10">
          <h1>领取所有空投代币的结果:</h1>
          <p>{typeof result === 'object' ? JSON.stringify(result, null, 2) : result}</p>
        </div>
      )}
    </div>
  )
}

export default QueryAirdrop


