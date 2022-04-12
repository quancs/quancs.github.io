+++
title = "Narrow-band Deep Speech Separation"
description = "Multi-channel Narrow-band Deep Speech Separation with Full-band Permutation Invariant Training"
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

## Abstract
This paper addresses the problem of multi-channel multi-speech separation based on deep learning techniques.
In the short time Fourier transform domain, we propose an end-to-end narrow-band network that directly takes as input the multi-channel mixture signals of one frequency, and outputs the separated signals of this frequency.
In narrow-band, the spatial information (or inter-channel difference) can well discriminate between speakers at different positions.
This information is intensively used in many narrow-band speech separation methods, such as beamforming and clustering of spatial vectors.
The proposed network is trained to learn a rule to automatically exploit this information and perform speech separation.
Such a rule should be valid for any frequency, thence the network is shared by all frequencies.
In addition, a full-band permutation invariant training criterion is proposed to solve the frequency permutation problem encountered by most narrow-band methods.
Experiments show that, by focusing on deeply learning the narrow-band information, the proposed method outperforms the oracle beamforming method and the state-of-the-art deep learning based method. 

## Method
This method includes two main parts:
the first part is to separate in each frequency;
the second part is about how to solve the frequency permutation problem to train the network.

The following content assumes we have *M* microphones and *N* speakers.

### 1) Narrow-band Deep Speech Separation
**Prepare Narrow-band Input.**
Why Narrow-band? It carries spatial information of speakers

![image](/blog/NBSS_examples/narrow_band_input.jpg "from time domain to narrow-band input")

**Network Processing:** Train network to separate different speakers in narrow-band

![image2](/blog/NBSS_examples/network_processing.jpg "Send narrow-band input to the network")

### 2) Full-band Permutation Invariant Training

**Frequency Permutation Problem**---How to find the correspondence of separated signals accross frequencies? One possible frequency permutation for two-speaker case:

![image3](/blog/NBSS_examples/fpp.jpg)

Our solution for FPP: **Frequency Binding**---Force the separated signals at the same output position to belong to the same speaker

![image4](/blog/NBSS_examples/frequency_binding.jpg)

**Loss Calculation**

$$ fPIT(\boldsymbol{\rm \widehat{Y}}^{1},\ldots, \boldsymbol{\rm \widehat{Y}}^{N}, \boldsymbol{\rm {Y}}^{1},\ldots,\boldsymbol{\rm {Y}}^{N})=\mathop{min}_{p\in \mathcal{P}}\frac{1}{N}\sum_n \mathcal{L}(\boldsymbol{{\rm {Y}}}^n,\boldsymbol{{\rm \widehat{Y}}}^{p(n)}) $$

where *P* is the set of all possible frequency permutations, and *p* is one possible frequency permutation in *P*.
And the negative SI-SDR [1] is used as the loss function for each prediction-target pair.

### 3) Narrow-band Conformer
The narrow-band conformer (NBC) proposed in [6] is used to replace the BiLSTM network used in [5], as the narrow-band speech separation shares a similar principle with the self-attention mechanism and convolutions in Conformer. 
The narrow-band conformer structure: 

 <img src="/blog/NBSS_examples/narrow-band_conformer.jpg" height = "200" alt="narrow-band conformer" align=center />
<!-- ![image5](/blog/NBSS_examples/narrow-band_conformer.jpg) -->

## Results 

Performance Comparision with SOTA Speech Separation Methods for 8-Channel 2-Speaker Mixtures (reported in narrow-band conformer [6])

Model			| #param	| NB-PESQ 	| WB-PESQ 	| SI-SDR	| RTF
------			|------:	|------:	|------:	|------:	|------:
Mixture 		| - 		| 2.05 		| 1.59 		| 0.0		| -
Oracle MVDR [2] | - 		| 3.16	 	| 2.65 		| 11.0		| -
FaSNet-TAC [3] 	| 2.8 M 	| 2.96 		| 2.53 		| 12.6		| 0.67
SepFormer [4]	| 25.7 M	| 3.17		| 2.72		| 13.2		| 1.69
SepFormerMC		| 25.7 M	| 3.42		| 3.01		| 14.9		| 1.70
NB-BLSTM [5] 	| 1.2 M		| 3.28 		| 2.81	 	| 12.8		| 0.37
NBC [6]			| 2.0 M		| **4.00**	| **3.78**	| **20.3**	| 1.32

## Examples

New examples of Narrow-band Conformer is coming soon.

Examples | Mix | Oracle MVDR [2] | FaSNet-TAC [3] | prop.
---------|-----|-------------|------------|------
1        | <audio controls src="/blog/NBSS_examples/1_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/1_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/1_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/1_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/1_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/1_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/1_spk2_p_NBSS.wav" ></audio>
2        | <audio controls src="/blog/NBSS_examples/0_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/0_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/0_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/0_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/0_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/0_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/0_spk2_p_NBSS.wav" ></audio>
3        | <audio controls src="/blog/NBSS_examples/2_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/2_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/2_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/2_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/2_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/2_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/2_spk2_p_NBSS.wav" ></audio>
4        | <audio controls src="/blog/NBSS_examples/3_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/3_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/3_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/3_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/3_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/3_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/3_spk2_p_NBSS.wav" ></audio>
5        | <audio controls src="/blog/NBSS_examples/4_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/4_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/4_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/4_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/4_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/4_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/4_spk2_p_NBSS.wav" ></audio>
6        | <audio controls src="/blog/NBSS_examples/5_mix.wav" ></audio> | <audio controls src="/blog/NBSS_examples/5_spk1_p_MVDR.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/5_spk2_p_MVDR.wav" ></audio> | <audio controls src="/blog/NBSS_examples/5_spk1_p_TAC.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/5_spk2_p_TAC.wav" ></audio> | <audio controls src="/blog/NBSS_examples/5_spk1_p_NBSS.wav" ></audio> </br> <audio controls src="/blog/NBSS_examples/5_spk2_p_NBSS.wav" ></audio>


## Source Code
This work is open sourced at github, see **[\[<font color=DarkOrchid>code</font>\]](https://github.com/quancs/NBSS)**, **[\[<font color=DarkOrchid>NBSS pdf</font>\]](https://arxiv.org/pdf/2110.05966)**, **[\[<font color=DarkOrchid>Narrow-band Conformer pdf</font>\]](https://arxiv.org/abs/2204.04464)**. If you like this work and are willing to cite us, please use:
```
@inproceedings{quan_multi-channel_2022,
	title = {Multi-channel {Narrow}-band {Deep} {Speech} {Separation} with {Full}-band {Permutation} {Invariant} {Training}},
	booktitle = {{ICASSP}},
	author = {Quan, Changsheng and Li, Xiaofei},
	year = {2022},
}
```
and
```
@article{quan_multichannel_2022,
	title = {Multichannel {Speech} {Separation} with {Narrow}-band Conformer},
	journal = {arXiv preprint arXiv:2204.04464},
	author = {Quan, Changsheng and Li, Xiaofei},
	year = {2022},
}
```

## References

[1] Jonathan Le Roux, Scott Wisdom, Hakan Erdogan, and John R. Hershey. SDR – Half-baked or Well Done? In ICASSP 2019.

[2] https://github.com/Enny1991/beamformers

[3] Yi Luo, Zhuo Chen, Nima Mesgarani, and Takuya Yoshioka. End-to-end Microphone Permutation and Number Invariant Multi-channel Speech Separation. In ICASSP 2020.

[4] C. Subakan, M. Ravanelli, S. Cornell, M. Bronzi, and J. Zhong. Attention Is All You Need In Speech Separation. In ICASSP 2021.

[5] Changsheng Quan, Xiaofei Li. **Multi-channel Narrow-band Deep Speech Separation with Full-band Permutation Invariant Training**. In ICASSP 2022.

[6] Changsheng Quan, Xiaofei Li. **Multichannel Speech Separation with Narrow-band Conformer**. arXiv preprint arXiv:2204.04464.
