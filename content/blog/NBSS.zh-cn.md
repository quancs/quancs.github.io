+++
title = "窄带语音分离"
description = "窄带语音分离和全频带组合不变训练"
author = "quancs"
date = "2021-12-04"
#tags = ["emoji"]
#[[images]]
#  src = "img/2019/03/pic02.jpg"
#  alt = "Desert Scene"
#  stretch = "stretchH"
+++

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

## 摘要
本文基于深度学习技术解决了多通道多语音分离问题。
我们提出了一种端到端窄带网络，以STFT域的一个频率的多通道混合信号作为输入，输出该频率的分离信号。
在窄带（单个频带）上，空间信息的不同（或通道间差异）可以很好地区分不同位置的说话人。
这种差异在许多基于窄带的语音分离方法中被大量使用，例如波束成形和空间矢量聚类。
本文提出的网络通过训练来学习如何自动利用此信息，来得到语音分离的规则。
这样的规则对任何频率都是有效的，因此网络可以由所有频率共享。
此外，本文还提出了一种全频带的组合不变训练方法，以解决大多数窄带方法所遇到的频率组合问题。
实验表明，通过对窄带信息的深度学习，本文提出的方法优于使用真值的波束成形方法和最先进的基于深度学习的分离方法。

## 方法
本方法主要包括两个部分：
第一个部分是在单个频带上如何用网络进行分离；
第二个部分是关于如何去解决频率组合问题来训练神经网络。

以下内容假设麦克风个数为*M*，说话人个数为*N*。

### 1) 窄带语音分离
**准备窄带的输入.**
为什么选择窄带? 因为窄带包含了充足的不同说话人的空间信息。

![image](/blog/NBSS_examples/narrow_band_input.jpg)

**网络处理:** 训练神经网络来实现在窄带输入上分离不同说话人的目的。

![image2](/blog/NBSS_examples/network_processing.jpg "向网络输入窄带信号")

### 2) 全频带组合不变训练（Full-band Permutation Invariant Training）

**频率组合问题（Frequency Permutation Problem）**——如何得到分离出的信号的跨频率的相关性？例子：两说话人情况下的一种可能的频率组合方式：

![image3](/blog/NBSS_examples/fpp.jpg)

本文提出的解决办法——**频率绑定**，强制认为在同一个输出位置的结果属于同一个说话人。

![image4](/blog/NBSS_examples/frequency_binding.jpg)

**损失函数**

$$ fPIT(\boldsymbol{\rm \widehat{Y}}^{1},\ldots, \boldsymbol{\rm \widehat{Y}}^{N}, \boldsymbol{\rm {Y}}^{1},\ldots,\boldsymbol{\rm {Y}}^{N})=\mathop{min}_{p\in \mathcal{P}}\frac{1}{N}\sum_n \mathcal{L}(\boldsymbol{{\rm {Y}}}^n,\boldsymbol{{\rm \widehat{Y}}}^{p(n)}) $$

其中，*P*是全部可能的频率组合组成的集合，*p*是其中一种可能的频率组合。
对于每对预测值和真值，负SI-SDR[1]被用来计算他们的损失。


## 实验结果

在8通道2说话人情况下，和当前最佳分离算法的性能比较

模型 | SDR | SI-SDR | NB-PESQ | WB-PESQ
------|------|------|------|------
分离前 | 0.18 | 0.00 | 2.05 | 1.6 
基于真值的MVDR [2] | 8.15 | 4.58 | 3.20 | 2.62 
FaSNet-TAC [3] | 12.81 | 12.26 | 2.92 | 2.49 
本文算法 | **13.89** | **13.26** | **3.31** | **2.87**

## 例子


例子 | 混合语音 | 基于真值的MVDR | FaSNet-TAC | 本文算法
---------|-----|-------------|------------|------
1        | <audio controls src="/blog/NBSS_examples/1_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/1_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/1_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/1_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/1_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/1_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/1_spk2_p_NBSS.wav" ></audio>
2        | <audio controls src="/blog/NBSS_examples/0_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/0_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/0_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/0_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/0_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/0_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/0_spk2_p_NBSS.wav" ></audio>
3        | <audio controls src="/blog/NBSS_examples/2_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/2_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/2_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/2_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/2_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/2_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/2_spk2_p_NBSS.wav" ></audio>
4        | <audio controls src="/blog/NBSS_examples/3_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/3_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/3_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/3_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/3_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/3_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/3_spk2_p_NBSS.wav" ></audio>
5        | <audio controls src="/blog/NBSS_examples/4_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/4_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/4_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/4_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/4_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/4_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/4_spk2_p_NBSS.wav" ></audio>
6        | <audio controls src="/blog/NBSS_examples/5_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/5_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/5_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/5_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/5_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/5_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/5_spk2_p_NBSS.wav" ></audio>


## 源代码
本方法已在github上开源，见 **[\[<font color=DarkOrchid>code</font>\]](https://github.com/quancs/NBSS)** 和 **[\[<font color=DarkOrchid>pdf</font>\]](https://arxiv.org/pdf/2110.05966)**. 如果你喜欢我们的工作且愿意引用，请使用：
```
@article{quan_multi-channel_2021,
	title = {Multi-channel {Narrow}-{Band} {Deep} {Speech} {Separation} with {Full}-band {Permutation} {Invariant} {Training}},
	journal = {arXiv preprint arXiv:2110.05966},
	author = {Quan, Changsheng and Li, Xiaofei},
	year = {2021},
}
```

## 参考文献

[1] Robin Scheibler. 2021. SDR -- Medium Rare with Fast Computations. arXiv:2110.06440.

[2] https://github.com/Enny1991/beamformers

[3] Yi Luo, Zhuo Chen, Nima Mesgarani, and Takuya Yoshioka. End-to-end Microphone Permutation and Number Invariant Multi-channel Speech Separation. In ICASSP 2020.
