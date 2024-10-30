"use client"

import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';



const WalConnect = () => {
  
  return (
    <div>
      <ConnectButton accountStatus="avatar" />
    </div>
  );
}

export default WalConnect;
