# Demo Video Instructions

This file provides instructions for creating and recording the `demo.mp4` video for the FHEVM Universal SDK competition submission.

## Video Requirements

- **Duration**: 2-5 minutes
- **Format**: MP4 (H.264 codec recommended)
- **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Frame Rate**: 30 fps minimum
- **Audio**: Clear narration explaining features
- **File Size**: < 100MB (use compression if needed)

## Recommended Structure

### Introduction (30 seconds)
- Show the Universal FHEVM SDK logo/title
- Brief explanation: "Framework-agnostic SDK for privacy-preserving apps"
- Mention key features: Easy installation, Wagmi-like API, Multi-framework support

### Installation Demo (1 minute)
- Show terminal with installation command:
  ```bash
  npm install @fhevm/universal-sdk
  ```
- Display code showing initialization (< 10 lines):
  ```typescript
  import { createFHEVM } from '@fhevm/universal-sdk'
  const fhevm = createFHEVM({ network: 'sepolia' })
  const encrypted = await fhevm.encrypt(42, 'euint32')
  ```
- Highlight simplicity and ease of use

### Live Demo - Private Rideshare (2 minutes)
1. **Homepage Overview**
   - Show the glassmorphism UI
   - Point out "FHEVM Ready" indicator
   - Show wallet connection button

2. **Passenger Flow**
   - Connect wallet (MetaMask)
   - Click "Request Ride" button
   - Show transaction confirmation
   - Display ride in history

3. **Driver Flow**
   - Switch to "Driver" tab
   - Click "Register as Driver"
   - Show registration confirmation
   - Toggle availability status
   - Display driver dashboard with stats

4. **Privacy Features**
   - Highlight encryption happening client-side
   - Show Sepolia Etherscan transaction
   - Explain that sensitive data is encrypted on-chain

### Multi-Framework Demo (1 minute)
- Quick code snippets showing:
  - React hooks usage
  - Next.js integration
  - Vue composable (optional)
  - Node.js backend example
- Emphasize "same SDK, different frameworks"

### Contract Interaction (30 seconds)
- Show Etherscan page for deployed contract
- Point to contract address: `0x5986FF19B524534F159af67f421ca081c6F5Acff`
- Show verified contract source code
- Display recent transactions

### Closing (30 seconds)
- Recap key benefits:
  - ✅ Usability: < 10 lines to get started
  - ✅ Completeness: Full FHEVM flow
  - ✅ Reusability: Framework-agnostic
  - ✅ Documentation: Comprehensive guides
  - ✅ Creativity: Production-ready example
- Show GitHub repository URL
- Display "Built for FHEVM Ecosystem" message

## Recording Tools

### Recommended Software
- **OBS Studio** (Free, cross-platform)
- **Loom** (Easy screen recording with webcam)
- **Camtasia** (Professional, paid)
- **ScreenFlow** (macOS, paid)
- **QuickTime** (macOS, free)

### Setup Tips
1. Close unnecessary applications
2. Clear browser history/cache
3. Use private/incognito mode for clean demo
4. Prepare test accounts with ETH
5. Have transactions ready to execute
6. Practice run-through before recording

## Video Checklist

Before recording:
- [ ] Local frontend running on http://localhost:1311
- [ ] Contract deployed to Sepolia
- [ ] Test wallet with Sepolia ETH
- [ ] Second wallet for driver demo
- [ ] Browser windows arranged
- [ ] Terminal ready for code demos
- [ ] Documentation pages open
- [ ] GitHub repository accessible

During recording:
- [ ] Show clear, readable text (zoom if needed)
- [ ] Narrate what you're doing
- [ ] Keep mouse movements smooth
- [ ] Wait for transactions to confirm
- [ ] Show loading states and confirmations
- [ ] Highlight key features

After recording:
- [ ] Compress video to < 100MB
- [ ] Test playback quality
- [ ] Verify audio is clear
- [ ] Add captions/subtitles (optional but recommended)
- [ ] Export as MP4 format
- [ ] Name file as `demo.mp4`

## Script Template

```
[INTRO]
"Welcome to the Universal FHEVM SDK - a framework-agnostic solution for building
privacy-preserving applications with Zama's FHE technology."

[INSTALLATION]
"Getting started is incredibly simple. Just run npm install @fhevm/universal-sdk,
and you're ready to go. Here's how easy it is to encrypt data and interact with
FHE contracts - less than 10 lines of code."

[DEMO - PASSENGER]
"Let me show you a real-world example - a private rideshare platform. As a passenger,
I can connect my wallet and request a ride. Notice the transaction is confirmed on
Sepolia, but the sensitive data is encrypted using FHE."

[DEMO - DRIVER]
"Now let's switch to the driver view. I can register as a driver, toggle my
availability, and accept ride requests. All the sensitive location and fare data
remains private on-chain."

[PRIVACY]
"The key innovation here is that encryption happens entirely client-side. Private
keys never leave your browser, and the FHEVM gateway handles decryption with proper
authorization."

[MULTI-FRAMEWORK]
"What makes this SDK unique is its framework-agnostic design. The same core works
with React, Next.js, Vue, or even Node.js backends. We provide familiar hooks and
patterns that web3 developers already know."

[CONTRACT]
"Here's our deployed contract on Sepolia Etherscan. It's fully verified and you can
see all the FHE operations happening on-chain with complete privacy."

[CLOSING]
"The Universal FHEVM SDK checks all the boxes: easy to use, complete FHEVM integration,
reusable across frameworks, well-documented, and demonstrated with a production-ready
example. Check out our GitHub repository and start building privacy-preserving apps
today!"
```

## Video Editing

### Basic Edits
- Trim unnecessary pauses
- Speed up slow sections (1.5x)
- Add smooth transitions between sections
- Include title cards for each section

### Optional Enhancements
- Background music (low volume, royalty-free)
- Highlight cursor movements
- Zoom in on important code
- Add text annotations
- Picture-in-picture for narration

### Compression

If file size > 100MB, use HandBrake:
1. Open demo.mp4 in HandBrake
2. Select preset: "Fast 1080p30"
3. Set quality: RF 23-25
4. Format: MP4
5. Encode and save

## Upload Instructions

Once recorded:
1. Save as `demo.mp4`
2. Place in root of `fhevm-react-template/` directory
3. Verify file size < 100MB
4. Test playback on different devices
5. Include in competition submission

## Alternative: YouTube Link

If the video is too large for direct upload:
1. Upload to YouTube (unlisted or public)
2. Create a file called `DEMO_VIDEO_LINK.txt`
3. Add the YouTube URL to the file
4. Include both in submission

---

**Need help recording?** Contact the team or check out example demo videos in our
Discord community.

**Sample demo videos:**
- [FHEVM Introduction](https://youtube.com/example1)
- [Privacy-Preserving Apps](https://youtube.com/example2)

---

Good luck with your demo! Make it engaging and showcase the power of the Universal
FHEVM SDK! 🎥✨
