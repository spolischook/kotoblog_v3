---
author: "Serhii Polishchuk"
title: "CIRCUIT #25: The Timer"
date: 2019-08-10
tags: ["Electronic Circuit"]
draft: false
---
<!--more-->
This circuit is also a multivibrator, but it is a special kind called
a one-shot multivibrator. When you finish wiring you’ll see
why it is called that. Press the KEY and release it immediately.
The LED will light and stay on for a few seconds and then go
off. It will stay on for the same amount of time every time you
press the KEY, even if you hold the KEY down longer
sometimes. The time the LED stays or is controlled by the 100
.F capacitor, so you could change the time by changing the
capacitor — or the resistor that controls its discharge (the
100K ohm). The name “one-shot” comes from the fact that the
LED only comes on once for each time the input is connected
by pressing the KEY.

{{< rawhtml >}}
<div class="circuit-schema">
  <iframe src="https://www.falstad.com/circuit/circuitjs.html?cct=$+1+0.000005+45.7144713268909+75+5+50%0Ar+160+80+160+144+0+680%0Ar+272+64+272+144+0+100000%0Ar+432+64+432+144+0+5600%0Ar+432+144+336+144+0+10000%0At+208+208+160+208+0+1+-2.038730102756162+0.08692334592396568+100%0At+384+208+432+208+0+1+0.49359709699110443+0.5805204421931505+100%0A209+192+144+256+144+0+0.000009999999999999999+1.545133006486977+1%0As+64+160+64+240+0+1+false%0A162+160+0+160+64+2+default-led+1+0+0+0.01%0Av+576+320+576+16+0+0+40+3+0+0+0.5%0Aw+160+64+160+80+0%0Aw+160+144+160+192+0%0Aw+192+144+160+144+0%0Aw+64+160+64+144+0%0Aw+64+144+160+144+0%0Aw+64+240+64+304+0%0Aw+160+224+160+304+0%0Aw+432+224+432+304+0%0Aw+64+304+160+304+0%0Aw+160+304+432+304+0%0Aw+432+304+576+320+0%0Aw+432+192+432+144+0%0Aw+256+144+272+144+0%0Aw+384+208+272+144+0%0Aw+336+144+208+208+0%0Aw+432+64+432+16+0%0Aw+272+64+272+16+0%0Aw+160+0+272+16+0%0Aw+272+16+432+16+0%0Aw+432+16+576+16+0%0A"></iframe>
</div>
{{< /rawhtml >}}
