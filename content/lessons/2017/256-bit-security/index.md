---
title: How secure is 256 bit security?
description: When a piece of cryptography is described as having "256-bit security", what exactly does that mean?  Just how big is the number 2^256?
date: 2017-07-08
video: S9JGmA5_unY
source: _2017/256.py
credits:
- Lesson by Grant Sanderson
- Translated to blog format by River Way
draft: true
---

## Cryptographic hash functions

The [last post](/lessons/bitcoin/) touched on the idea of a cryptographic hash function. These are functions which take in an input of arbitrary length, and return a fixed-length output, but with the added condition that the inverse function is computationally infeasible.

For example, these cryptographic hash functions are used to store passwords without revealing what those passwords are. If your database stores usernames and the associated hash of the corresponding password, then when a user enters their password, you can check if it’s correct by computing its hash and comparing it with what is stored. But anyone looking at the database should have no way to reverse engineer what the passwords are. [1]

These hash functions are ubiquitous throughout cryptography, from digital signatures to proofs of work and numerous other applications. They distill a core theme of cryptography, which is to find tasks which are easy in one direction but hard in another.

For example, the function SHA256, which takes in inputs of arbitrary length and outputs 256 bits, is believed to be cryptographically secure. This means if you want to find an input which produces a particular 256-bit output, there is no more efficient method than to simply guess and check.

{{< figure image="guesses.png" caption="If a hash function is considered cryptographically secure, it means that to find an input which produces a particular output, there is no better method than to repeatedly guess and check." width="60%" />}}

The outputs of this hash function behave like a random sequence of numbers, so it’s helpful to think of rolling a die. How many times do you need to roll a die until you get a particular number, say a $1$? On average, it’ll take $6$ rolls. [2]

But here, there are not $6$ possible outputs, there are $2^{256}$. So on average it will take $2^{256}$ guesses to find an input with a particular hash. But how difficult is this, exactly? $2^{256}$ is a number so far removed from anything we ever deal with that it can be hard to appreciate its size. But let’s give it a try.

{{< section >}} 

## Appreciating Large Powers of Two

{{< figure image="breakdown.png" width="60%" />}}

The human mind is best at breaking down concepts into smaller pieces to analyze. $2^{256}$ is $2^{32}$ multiplied by itself eight times. $2^{32}$ is about 4 billion, which is a number we can at least start to think about, so all we need to do is appreciate what multiplying 4 billion times itself 8 successive times feels like.

#### **4 Billion Hashes Per Second**

{{< figure image="progress1.png" />}}

The GPU on your computer can let you run parallel computations incredibly quickly. If you specially program a GPU to run a cryptographic hash function over and over, a really good one can do just under a [billion hashes per second](https://en.bitcoin.it/wiki/Non-specialized_hardware_comparison).

{{< figure image="GPU.png" width="60%" />}}

Let’s say you cram a computer with extra GPUs so that it can guess and check 4 billion times per second. So our first 4 billion is the number of hashes per second per computer.

#### **4 Billion Computers**

{{< figure image="progress2.png" />}}

Now picture 4 billion of these GPU-packed computers. For comparison, even though Google does not make the number of servers it runs public, estimates have it somewhere in the single-digit millions.

{{< figure image="kilogoogle.png" width="60%" />}}

In reality, most of those servers are much less powerful than our imagined GPU-packed machine, but if Google replaced all its millions of servers with machines like this, 4 billion machines would mean about 1,000 copies of this souped-up Google, which I’ll call one KiloGoogle++.

#### **4 Billion KiloGoogles**

{{< figure image="progress3.png" />}}

There are about 7.9 billion people on Earth, so imagine giving a little over half the people on Earth their own personal KiloGoogle.

{{< figure image="planet.png" width="60%" />}}

{{< question
  question="If you were the president of this KiloGoogle filled Earth, how many guesses could you order to be checked per second?"
  choice1="$2^{32}$"
  choice2="$2^{64}$"
  choice3="$2^{96}$"
  choice4="$2^{128}$"
  correct=3
  explanation="There are $2^{32}$ citizens, each with their personal KiloGoogle that contains $2^{32}$ GPU-packed servers which can each run $2^{32}$ hashes per second. $2^{32}\times 2^{32}\times 2^{32}=2^{96}$."

>}}

#### **4 Billion Earths**

{{< figure image="progress4.png" />}}

Now imagine 4 billion copies of this Earth. The Milky Way has between 100 and 400 billion stars, so this would be akin to 1% of all stars in the galaxy having a copy of Earth, where half the population on each has their own personal KiloGoogle.

{{< figure image="milkyway.png" width="60%" />}}

#### **4 Billion Milky Ways**

{{< figure image="progress5.png" />}}

Now picture 4 billion copies of the Milky Way, and call this your GigaGalactic Super Computer, running $(2^{32})^5 = 2^{160}$ guesses per second.

{{< figure image="ggsc.png" width="60%" />}}

#### **4 Billion Seconds**

{{< figure image="progress6.png" />}}

4 billion seconds is about 126 years, which is still a reasonable amount of time to want to keep something hidden. Maybe you’re hiding a digital treasure for your great-great-great grandchildren!

#### **4 Billion Seconds Squared**

{{< figure image="progress7.png" />}}

4 billion times 126 years is about 507 billion years. This is roughly 37 times the age of the universe. The Earth will have been swallowed up by the sun a long time before this, hopefully nobody cares about your password anymore.

#### **1 in 4 Billion Success Rate**

{{< figure image="progress8.png" />}}

So even if you were to have your GPU-packed KiloGoogle-per-person multi-planetary GigaGalactic Super Computer guessing numbers for 37 times the age of the universe, it would still only have a 1 in 4 billion chance of finding a correct guess.

{{< question
  question="If you had your very own KiloGoogle, how many years would it take you to match a GigaGalactic Super Computer with its success rate of 1 in 4 billion?"
  choice1="$4\times 10^{40}$"
  choice2="$5\times 10^{50}$"
  choice3="$6\times 10^{60}$"
  choice4="$7\times 10^{70}$"
  correct=1
  explanation="A GigaGalactic Super Computer takes 507 billion ($5.07\times 10^{11}$) years to get a success rate of 1 in 4 billion. Since a GGSC is $2^{96}$ times more powerful than a KiloGoogle, a KiloGoogle will reach a success rate of 1 in 4 billion in $5.07\times 10^{11}\times 2^{96}\approx 4\times 10^{40}$ years. Slightly longer than waiting for cookies to cool from the oven (both seem like forever though)!"

>}}

{{< section >}} 

## Modern Bitcoin Hashing

In 2021, all the miners put together make guesses at a rate of about [100 billion billion](https://www.blockchain.com/charts/hash-rate) ($10^{20}\approx 2^{66}$ ) hashes per second. Which is four times more than what was described as a KiloGoogle.

This is not because there are actually billions of GPU packed machines out there, but because miners use something about [ten thousand](https://en.bitcoin.it/wiki/Mining_hardware_comparison) times better than a GPU: Application-Specific Integrated Circuits.

{{< pi-creature emotion="miner" >}}

These are pieces of hardware specifically designed for bitcoin mining and nothing else. It turns out that there are a lot of efficiency gains to be had when you throw out the need for general computation, and design your integrated circuits for a single, specific task.

