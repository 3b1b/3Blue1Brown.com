---
title: But what is the Fourier Transform?  A visual introduction.
description: An animated introduction to the Fourier Transform, winding graphs around circles.
date: 2018-01-26
video: spUNpyF58BY
source: _2018/fourier.py
credits:
- Lesson by Grant Sanderson
---

# A Visual Interpretation of Fourier Transforms

This right here is the visual you and I will build up to in this post:

{{<figure image="com_1.png" video="motivation.mp4" width="75%">}}
{{</figure>}}

This represents the inner workings of an incredibly important tool for math, engineering, and most of science: The Fourier transform.
While this post is aimed at being a friendly introduction, building up to a visual understanding that motivates the potentially-complicated-looking formula, my hope is that even those of you who are already somewhat familiar with Fourier Transforms will find it enriching to unpack what it is really doing.

## Fourier transform of sound waves

Let's begin with a classic example, decomposing frequencies in sound waves.

Imagine you are listening to a pure A tone, which has the frequency of 440 beats per second.
This means that if you were to measure the air pressure next to your ear over time, it would oscillate 440 times every second.

{{<figure image="a440.png" video="a440.mp4" width="75%">}}
{{</figure>}}

If you were to take a lower tone, like a D, it might oscillate slower at (for example) 294 beats per second.
Playing both sounds at the same time without any external stimuli, the resulting pressure vs time graph would also oscillate around the ambient air pressure with time, but it would look more complicated than a simple sine wave.
Its deviation from the ambient air pressure at any point in time would be the sum of what it would be with a pure A and what it would be with a pure D, like so:

{{<figure image="AD.png" video="AD.mp4" width="75%">}}
Here, we have drawn small white lines on the notes for A (bottom, yellow) and D (middle, pink) and shown that they create the final pressure vs time graph (top, green) when added together. 
When the two waves are increasing at the same time, the resulting waveform is high. Similarly, when the two waveforms are decreasing at the same time, we see that the resulting waveform is low.
Still at other points, the two waves cancel each other out.
All-in-all, the resulting waveform is not a pure sine wave, but instead something more complicated.
{{</figure>}}

<br>

Similarly, if we were to play more pure frequencies at the same time, the resulting waveform would be a sum of these sine waves, but even more complicated.

{{<figure image="DAFC.png" video="DAFC.mp4" width="75%">}}
Similar to the previous image, we have drawn a wite line at a particular point in time to show that the final pressure vs time graph (top, blue) is a sum of 4 different frequencies: D (pink), A (yellow), F (teal), and C (red).
If you were to record yourself with a microphone, you might find waveform that is similar to this final pressure vs time graph which could similarly be composed of a set of different frequencies.
{{</figure>}}

A microphone recording any sound just picks up on the air pressure at many different points in time.
It only "sees" the final sum.
So our central question is how you can take a signal like this,
and decompose it into the pure frequencies that make it up.
Pretty interesting, right?
Adding up those signals really mixes them all together.
So pulling them back apart feels akin to unmixing multiple paint colors that have all been stirred up together.  Or as Kalid Azad [nicely phrased it](https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/), "Given a smoothie, it finds the recipe."

The general strategy will be to build for ourselves a mathematical machine that treats signals with a given frequency differently from how it treats other signals.  Moreover, it should be able to detect the presence of that frequency even if it's been mixed together with others, for example recognizing that the messy waveform above has a pure A440 hiding inside it.
Writing down what this machine does as a formula will give us the Fourier transform.

## Decomposing arbitrary signals 

To start, let's draw a sine wave at 3 beats per second from 0 to 4.5 seconds:

{{<figure image="3ps.png" width="75%">}}
{{</figure>}}

This is similar to the A or D frequencies mentioned in the previous section.  If you were just given this graph, how could you recognize that it's oscillating at 3 beats per second?  What operation could you perform that takes in this graph and spits out the number 3?

"That's a pretty dumb question," you might say, "just count the number of humps in a given second!"  Fair enough, that works, but that won't help us at all once the signal has been added to others.  So is there some *other* operation you could perform that detects the specialness of the number 3 here, but which has some hope of still detectingi that number 3 after the signal has been added to others?

To do this, we'll start by "wrapping it up" around a circle, like this.

{{<figure image="windy_arrows.png" video="windy_arrows.mp4" width="75%">}}
{{</figure>}}

You can think of the wound up graph on the bottom as being drawn by a little vector rotating at a steady rate with time.  As it rotates, it's length is changing to match the height of the sine graph up top at the corresponding time.

For those of you comfortable with polar coordinates, what we're doing here is very similar to representing the original signal as a polar graph.
However, we have an important extra parameter that we can tweak: How quickly is the vector rotating with time?
In the visual above, it was rotating so as to make a complete cycle after 2 seconds.  Since it's length was changing between short and long 3 times per second, this resulted in a shape that looks somewhat like a flower with 6 petals.

This is important, there are 2 different frequencies at play.

1. The frequency of the original signal, 3 beats per second.
2. The frequency that we are wrapping the sine wave along the circle, which at the moment is at 0.5 cycles per second.


If we set the vector rotating faster or slower, changing the "winding frequency", the resulting shape it traces out would be something different.

{{<figure image="3freq2.png" video="3freq2.mp4" width="75%">}}
{{</figure>}}

The key intuition here is that we are wrapping the signal around a circle, and depending on how tightly we wind the sine wave, we can find different patterns.
So what happens when when the winding frequency is *the same* as the original signal's frequency?
When our little vector rotates around the circle at 3 cycles per second?
Well, we get the following plot:

{{<figure image="winding_match.png" video="winding_match.mp4" width="75%">}}
{{</figure>}}

Notice, the resulting curve it draws out is off-balance to the right.
The rotating vector is always longer when it's pointing to the right, and shorter when it's pointed to the left, because the frequency with which its length changes is identical to the frequency with which it rotates around the circle.

Would we be able to use this information for our frequency unwinding machine?
Well, we actually can!

First, let's imagine that the pattern was made of something with some weight, like a metal wire.
Now put a dot at the center of mass location, and as we change the winding frequency, the center of mass will kind of wobble about.
We'll revisit what we mean by "center of mass" here a bit further down, but for the moment we're looking for an intuitive way to measure how much this wound up graph is off-balance.

In most cases, the center of mass stays relatively close to the origin, but when the winding frequency is the same as the frequency for our signal, the center of mass is unusually far to the right.
To keep track of this effect, let's draw the x-coordinate for the center of mass as the winding frequency changes.

{{<figure image="com_1.png" video="com_1.mp4" width="75%">}}
Here, we have taken 5 separate snapshots of the sine wave wound around the circle for winding frequencies of 0.2, 1.5, 3, 4, and 5 cycles per second.
In each figure, we have plotted the center of mass as a red dot, and it is clear that the dot is furthest from the center of the plot with a winding frequency of 3 cycles per second.
Away from that winding frequency, the center of mass location seems to wobble around the center of the plot.
{{</figure>}}

There is one small caveat: the center of mass seems to be a maximum distance from the center of the plot at a winding frequency of 0 cycles per second.
What gives?
Well, this is because we have started with a sine wave that oscillates between 0 and 2, and when the winding frequency is 0, the wire is just a straight line pointing to the right, meaning that the center of mass is halfway between 0 and 2, or 1.
Really, that spike at 0 is measuring the fact that the average value of the graph as a whole is positive.
If we centered the initial sine wave around 0, lettint it dip into negative values, there would be no spike above the winding frequency of 0.

{{<figure image="centered.png" width="75%">}}
{{</figure>}}

The motive for using purely positive sine waves as our starting examples in
this post is that negative values are a little weirder to think about as you wind up the graph.
But the core logic stays the same in either case.

At this stage, we can call this plot tracking the center of mass of our wound up graph the "Almost Fourier Transform" of the original signal.
It allows for us to pick out the frequency of the signal by seeing where the spike is.
Next, suppose we take a different signal, like one with a lower frequency of 2 beats per second.
We could do the same thing and find a peak at 2 cycles per second, as shown here:

{{<figure image="2ps.png" width="75%">}}
{{</figure>}}

The most interesting aspect of this machine is that it will allow us to decompose any arbitrary signals into it's constituent waveforms.
To show this, let's combine the 2 and 3 frequency waves and do the same operation: tracking the center of mass coordinate and look for peaks in the winding frequency plot.
This is shown below:

{{<figure image="full_machine.png" video="full_machine.mp4" width="75%">}}
{{</figure>}}

Here, we see 2 different frequencies at both 2 and 3 beats per second, which is exactly the same as the two "Almost Fourier Transformed" plots added together.
Simply put, the sum of the two "Almost Fourier Transformed" signals is the same as the "Almost Fourier Transform" of the two summed together, as shown here:

{{<figure image="almost.png" width="75%">}}
{{</figure>}}

The way a mathematician might phrase this is that our "Almost Fourier Transform" operation is *linear*.
The curious among you may want to pause for a moment to reflect on why this is true.
It ultimately stems from the fact that the x-coordinate of the sum of two vectors is the sum of their x-coordinates.
This, by the way, is why we had it track the x-coordinate of the center of mass of the graph, rather than tracking its distance from the origin.
For the full frequency information, you'd also want to keep track of the y-coordinate, but more on that below.

So this little mathematical machine does exactly what we wanted: it pulls out the constituent frequencies from a provided waveform, essentially unmixing a mixed bucket of paint.
Before moving on to the mathematical formalism here, it is a good idea to discuss key application of this machine in sound editing, which is similar to the application we showed above with the Fourier transform of sound waves.

## An example in sound editing

Let's imagine that you have a voice recording, but there is an annoying ringing sound in it that you want to get rid of.
Remember that this signal will be received as a plot of intensity over time.
Ideally, we would like to think of this signal in terms of frequencies, so we need to take the Fourier Transform of the signal to find the most prominent frequencies.
From there, we will the annoying high-pitched ringing sound as a spike on the far right of the plot, as shown below:

{{<figure image="sound_example.png" width="75%">}}
{{</figure>}}

If we remove the spike by smooshing it out on the frequency plot, we will have a sound that is almost identical to the recording, but without the ringing.
To go back to the original signal, we need to use another concept known as the inverse Fourier transform, and after applying this operation, we have effectively removed the high-pitched ringing noise from the signal.

So at this stage, we should get back to the heart of this post: what exactly is the mathematical formalism for a Fourier Transform?

## Mathematical formalism of Fourier transform

Going back to the previous example of the "Almost Fourier Transform," the first thing one might criticize is the fact that the movement of the center of mass for our winding wire has both an $x$ and a $y$ component, but we are only plotting the $x$-component!
Let's attack that issue first.

In principle we could treat the center of mass as a 2d vector, however often in mathematics when rotation is involved, the formulas become notably more elegant when we represent 2d values as complex numbers.
For this example, the center of mass would become complex number with both a real and imaginary part.
Why bring in imaginary numbers?
Well, Euler's formula is why.

Euler's formula famously tells us that if we were to take $e^{i n}$, where $n$ is some arbitrary number (like 2.0), and $i$ is the typical complex variable of $\sqrt{-1}$, we will find ourselves on the point we would get by walking counter-clockwise $n$ units along a circle of radius 1 in the complex plane, as shown below:

{{<figure image="e2i.png" video="e2i.mp4" width="75%">}}
{{</figure>}}

If you are curious, I've made two multiple videos explaining why this is true, a [quick one](../differential_equations/e_to_i/e_to_i.md) offering an explanation from the perspective of differential equations, a [longer one](../misc/euler/euler.md) offering a connection to group theory, and a [longer one still](https://youtu.be/ZxYOEwM6Wbk) targeted at someone just seeing it for the first time.

Armed with Euler's formula, how might we describe rotating at a rate of $f$ cycles per second?
Well, it would simply be:

$$
e^{2\pi i f t}
$$

Where $2\pi$ is the full length of the circumference of the circle, $f$ is the desired frequency, and $t$ is a variable for time.
This means that at any given time $t$, we have progressed some amount along the circle.
Ultimately, this gives us nice notation for describing how we might wind ourselves around a circle, but the convention for Fourier transforms is that we move in the clockwise (not counter-clockwise) direction, so it is more accurate to use $e^{-2\pi i f t}$ with a negative sign.

If we were to take any signal and describe it as a function, like $g(t)$, then

$$
g(t)e^{-2\pi i f t}
$$

will provide the function of $g$ at time $t$ and also the point along the circle $e^{-2\pi i f t}$.
This is almost precisely the same as the winding machine we created before!
Now we just need some sort of formula to capture the motion of the center of mass.

To approximate this, one might sample a large set of different times along the provided waveform, see where they end up on the wound-up graph, and take an average:

$$
\frac{1}{N}\sum_{k=1}^N g(t_k)e^{-2\pi i f t}.
$$

Pictorially, it would look like this:

{{<figure image="sum.png" video="sum.mp4" width="75%">}}
{{</figure>}}

As we add more points, it becomes more accurate, and in the continuous limit, the sum becomes an integral:

$$
\frac{1}{t_2-t_1}\int_{t_1}^{t_2} g(t)e^{-2 \pi i f t}dt.
$$

Here, we still need to divide the equation based on the size of the time interval $(t_2-t_1)$.
Though this might seem intimidating, the whole expression is really just finding the center of mass of the wound-up graph<sup id="a1">[[1]](#f1)</sup>.

Great!  Step-by-step, we have built up this kind of complicated, but, let's face it, surprisingly small expression for the whole winding machine idea that I talked about.

And now, there is only one final distinction to point out between this and the actual, honest-to-goodness Fourier transform.
Namely, just don't divide out by the time interval.

$$
\underbrace{\frac{1}{t_2-t_1}\int_{t_1}^{t_2} g(t)e^{-2 \pi i f t}dt}_{\text{Center of mass}}
\qquad\rightarrow\qquad
\underbrace{\int_{t_1}^{t_2} g(t)e^{-2 \pi i f t}dt}_{\text{Scaled center of mass}}
$$

The Fourier transform is just the integral part.
What that means is that instead of looking at the center of mass, you would scale it up by some amount.
If the portion of the original graph you were using spanned three seconds, you would multiply the center of mass by three.
If it was spanning six seconds, you would multiply the center of mass by six.

{{<figure image="6seconds.png" video="6seconds.mp4" width="75%">}}
{{</figure>}}

Physically, this has the effect that when a certain frequency persists for a long time, then the magnitude of the Fourier transform at that frequency is scaled up more and more.

For example, in the image below, we have a pure frequency of two beats per second, and it's being wound up at two cycles per second.
In that case, no matter how long the duration of our signal, the center of mass stays roughly in the same spot, right?  It's just tracing out the same shape.

{{<figure image="to_infinity1.png" width="75%">}}
{{</figure>}}

But what makes the honest-to-goodness Fourier Transform different from our "Almost Fourier Transform" is that the longer the signal persists, the larger the value of the Fourier transform, at that frequency.

For other winding frequencies, though, even even ones just barely different from 2, the effect of increasing the duration is canceled out by the fact that for longer time intervals, you're giving the wound up graph more of a chance to balance itself around the circle.

{{<figure image="to_infinity2.png" video="to_infinity.mp4" width="75%">}}
{{</figure>}}

## Summary

That is...a lot of different moving parts, so let's step back and summarize what we have so far.

The Fourier transform of an intensity vs. time function, like $g(t)$, is a new function, which doesn't have time as an input, but instead takes in a frequency, what I've been calling "the winding frequency."
In terms of notation, by the way, the common convention is to call this new function $\hat g(f)$ with a little circumflex on top of it.

{{<figure image="imag_too.png" width="75%">}}
{{</figure>}}

The output of this new function is a complex number, some point in the 2D plane, that corresponds to the strength of a given frequency in the original signal.  The plot that I've been graphing for the Fourier transform is just the real component of that output, the x-coordinate.

But you could also graph the imaginary component separately, if you wanted a fuller description.

{{<figure image="conclusion.png" width="75%">}}
{{</figure>}}

And all of this is being encapsulated inside that formula that we built up.

$$
\hat g(f) = \int_{t_1}^{t_2} g(t)e^{-2 \pi i f t}dt
$$

Out of context, you can imagine how seeing this formula would seem sort of daunting.  However, this expression carries with it a very rich, intuitive meaning once you know how to read each of its parts.

1. The value $e^{-2 \pi i f t}$ describes a value with length 1, rotating at a constant rate so that it makes $f$ full cycles per unit time.
2. multiplying that by the function $g(t)$ means drawing a wound up version of the graph
3. The integral can be interpreted in terms of the center of mass of the wound-up graph, scaled up by the size of the time interval.


Even still, I'm lying to you a little.  But only a little.  Even though in practice, with things like sound editing, you'll be integrating over a finite time interval, the theory of Fourier transforms is often phrased where the bounds of this integral are $-\infty$ and $\infty$.

$$
\hat g(f) = \int_{-\infty}^{\infty} g(t)e^{-2 \pi i f t}dt
$$

Concretely, what that means is that you consider this expression for all possible finite time intervals, and you just ask, "What is its limit as that time interval grows to $\infty$?"

{{<figure image="scaling.png" video="scaling.mp4" width="75%">}}
{{</figure>}}

There is a lot more to say about this, but this will wrap up the discussion for now.
Please let us know if there's anything else you would like to discuss!

### Notes
<b id="f1">1</b> Here it's worth adding some more clarity on what we mean by "center of mass".
In the picture above, notice that that points are being sampled in a way that's evenly spaced across time, but this is not necessarily evenly spaced along the *length* of the graph.
In effect, if we're thinking of the graph as a wire, the density of that wire is constant with respect to time, as if the rotating vector drawing it is outputting a constant amount of mass per unit time. 
But this implies the wire would be a little less dense in places where the graph's height changes rapidly.
In principle, you could define a similar-but-distinct cousin of the Fourier transform by treating this "wire" with constant mass per unit of arc length, but the math would become less elegant.
[↩](#a1)

## Licensing

##### Text

The text is based on a video by [Grant Sanderson](https://www.3blue1brown.com/about), adapted and expanded to the blog format by [James Schloss](https://github.com/leios) and is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/legalcode).

[<p align="center"><img src="../../cc/CC-BY-NC-SA.svg" style="width:15%"/></p>](https://creativecommons.org/licenses/by-sa/4.0/)

<script>
MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
</script>
