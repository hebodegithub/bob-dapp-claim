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

const formSchema = z.object({
  username: z.string().min(10, {
    message: "Must be ether address.",
  }),
})

const QueryAirdrop = () => {

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null); // 用于存储合约返回的结果

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

  // 更新表单值
  useEffect(() => {
    if (walletAddress) {
      form.setValue("username", walletAddress); // 更新输入框的值为钱包地址
    }
  }, [walletAddress]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: walletAddress || "", // 默认填充钱包地址
    },
  })


  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // 合约地址和 ABI
    const contractAddress = "0x0406d613c186A48f40f986e301b1e070988d459D"; // 替换为您的合约地址
    const contractABI = [
      {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      // {
      //   "inputs": [],
      //   "name": "claimToken",
      //   "outputs": ["string"], // 假设返回值为字符串
      //   "stateMutability": "view",
      //   "type": "function"
      // }
    ];

    // 创建以太坊提供者和合约实例
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // 获取签名者
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      try {
        // 调用合约的 claim 函数
        const tx = await contract.claim();
        console.log("Transaction sent:", tx);

        // 等待交易确认
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        // 假设合约返回一个字符串作为结果
        const result = await contract.claimToken(); // 重新调用以获取返回值
        setResult(result); // 更新状态以存储返回值
      } catch (error) {
        console.error("Error calling contract:", error);
      }
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
  }


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>空投代币数量查询</FormLabel>
                <FormControl>
                  <Input placeholder="0xaddress" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">查询</Button>
        </form>
      </Form>
      {/* 展示合约返回的结果 */}
      {result && (
        <div className="mt-4">
          <h2>查询空投的结果:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}

export default QueryAirdrop


