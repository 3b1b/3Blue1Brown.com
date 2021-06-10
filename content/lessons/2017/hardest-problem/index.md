---
title: The hardest problem on the hardest test
description: A geometry/probability question on the Putnam, a famously hard test, about a random tetrahedron in a sphere.  This offers an opportunity not just for a lesson about the problem, but about problem-solving tactics in general.
date: 2017-12-08
video: OkmNXy7er84
source: _2017/putnam.py
credits:
- Lesson by Grant Sanderson
- Translated to blog format by James Schloss
---

## The problem

There's a famous math competition for undergraduate students known as the Putnam.
It's 6 hours long and consists of 12 questions, broken up into two different 3-hour sessions over two days.
Each question being scored on a 1-10 scale, so the highest possible score is 120.

{{< figure image="putnam_overview.png" />}}

And yet, despite the fact that the only students taking it each year are those who are clearly already pretty into math, given that they opt into such a test, the median score tends to be around 1 or 2.

{{< pi-creature emotion="hesitant" text="It's a hard test"  >}}

For each day the six problems tend to increase in difficulty, ranging from pretty difficult to exceedingly challenging.
But of course, difficulty is sometimes in the eye of the beholder.

But here's the thing about those 5's and 6's.  Even though they're positioned as the hardest problems on a famously hard test, quite often these are the ones with the most elegant solutions available, often involving some subtle shift in perspective that transforms it from challenging to simple.

Here I'll share with you one problem which came up as question A6 on the [1992 Putnam exam](https://kskedlaya.org/putnam-archive/1992.pdf).
Rather than just jumping straight to the solution, which in this case will be surprisingly short, let's take the time to walk through how you might stumble upon the solution yourself.
This story is more about the problem-solving process than the particular problem used to exemplify it.

Here's the question:

> Four points are chosen at random on the surface of a
sphere. What is the probability that the center of the
sphere lies inside the tetrahedron whose vertices are at
the four points? (It is understood that each point is independently chosen relative to a uniform distribution on
the sphere.)

{{< figure image="2sphere.png" />}}

Take a moment to digest the question. You might start thinking about which of these tetrahedra contain the sphere's center, which ones don't, and how you might systematically distinguish the two.

How do you approach a problem like this? Where do you even start?
Well, it's often a good idea to think about simpler cases, so let's bring things down into two dimensions.

## The two-dimensional case

Suppose you choose three random points on a circle.
It's always helpful to name things, so let's call these fellows $P_1$, $P_2$, and $P_3$.
What's the probability that the triangle formed by these points contains the center of the circle?

{{< figure image="2D2.png" />}}

This is still a hard question, so you should ask yourself if there's a way to simplify the question even further.
We still need a foothold, something to build up from.
Maybe you imagine fixing $P_1$ and $P_2$ in place, only letting $P_3$ vary.
In doing this, you might notice that there's special region, a certain arc, where when $P_3$ is in that arc, the triangle contains the circle's center.

{{< figure video="2d_2.mp4" />}}

Specifically, if you draw a lines from $P_1$ and $P_2$ through the center, these lines divide the circle into 4 different arcs.
If $P_3$ happens to be in the arc opposite $P_1$ and $P_2$, the triangle will contain the center.
Otherwise, you're out of luck.

{{< figure image="arcs.png" />}}

It's certainly easier to visualize now, but can you answer the question?

{{< question
  question="If $P_1$ and $P_2$ are fixed in place on the circle, with an arc length $\alpha$ between them, and $P_3$ is a point chosen randomly with uniform on the circle, what is the probability that the triangle $\Delta P_1 P_2 P_3$ contains the center of the circle?"
  choice1="$\alpha$"
  choice2="$\alpha / 360^{\circ}$"
  choice3="$180^{\circ} - \alpha$"
  choice4="$(180^{\circ} - \alpha) / 360^{\circ}$"
  correct=2
  explanation="As mentioned above, the point $P_3$ needs to land in the arc opposite $P_1$ and $P_2$. This arc has the same length as the one between $P_1$ and $P_2$, which the questions calls $\alpha$, so this probability is the length of that arc divided by the full circumference of the circle."
>}}

So what proportion of the circle does this arc take up?
That depends on the first two points.
If they are 90 degrees apart from each other, for example, the relevant arc is $\frac{1}{4}$ of the circle.

{{< figure image="90.png" />}}

But if those two points are farther apart, the proportion might be closer to 1/2.

{{< figure image="180.png" />}}

If they are really close, that proportion might be closer to 0.

{{< figure image="r0.png" />}}

If $P_1$ and $P_2$ are chosen randomly, with every point on the circle being equally likely, what's the average size of the relevant arc?

Maybe you imagine fixing $P_1$ in place, and considering all the places that $P_2$ might be.

{{< figure video="2d_3.mp4" />}}

All of the possible angles between these two lines, every angle from 0 degrees up to 180 degrees is equally likely, so every proportion between 0 and 0.5 is equally likely, making the average proportion 0.25.
Since the average size of this arc is $\frac{1}{4}$ this full circle, the average probability that the third point lands in it is $\frac{1}{4}$, meaning the overall probability of our triangle containing the center is $\frac{1}{4}$.

{{< figure video="2d_4.mp4" />}}

## The three-dimensional case

Great! Can we extend this to the 3d case? If you imagine 3 of your 4 points fixed in place, which points of the sphere can that 4th point be on so that our tetrahedron contains the sphere's center?
As before, let's draw some lines from each of our first 3 points through the center of the sphere.

{{< figure image="3lines.png" width="50%" />}}

And it's also helpful if we draw the planes determined by any pair of these lines.

{{< figure image="3planes.png" width="50%"/>}}

These planes divide the sphere into 8 different sections, each of which is a sort of spherical triangle.
Our tetrahedron will only contain the center of the sphere if the fourth point is in the section on the opposite side of our three points.

{{< figure image="green_shell.png" width="50%"/>}}

Unlike the 2d case, it's rather difficult to think about the average size of this section as we let our initial 3 points vary.
Those of you with some multivariable calculus under your belt might think to try a surface integral.
And by all means, pull out some paper and give it a try, but it's not easy.
And of course it should be difficult, this is the 6th problem on a Putnam!

## The shift in perspective

But let's back up to the 2d case, and contemplate if there's a different way to think about it.
This answer we got, $\frac{1}{4}$, is suspiciously clean and raises the question of what that 4 represents.
One of the main reasons I wanted to cover this topic is that what's about to happen carries a broader lesson for mathematical problem-solving.

The lines that we drew from $P_1$ and $P_2$ through the origin made the problem easier to think about.
In general, whenever you've added something to your problem setup which makes things conceptually easier, see if you can reframe the entire question in terms of the thing you just added.

{{< figure image="new_objects.png" />}}

In this case, rather than thinking about choosing 3 points randomly, start by saying choose two random lines that pass through the circle's center.
For each line, there are two possible points they could correspond to, so flip a coin for each to choose which of those will be $P_1$ and $P_2$.

{{< figure image="procedure.png" />}}

Choosing a random line then flipping a coin like this is the same as choosing a random point on the circle, with all points being equally likely, and at first it might seem needlessly convoluted way to describe choosing two random points.
But by making those lines the starting point of our random process things actually become easier.

We'll still think about $P_3$ as just being a random point on the circle, but imagine that it was chosen before you do the two coin flips.

{{< figure image="procedure_2.png" />}}

You see, once the two lines and a random point have been chosen, there are four possibilities for where $P_1$ and $P_2$ end up, based on the coin flips, each one of which is equally likely.
But one and only one of those outcomes leaves $P_1$ and $P_2$ on the opposite side of the circle as $P_3$, with the triangle they form containing the center.
So no matter what those two lines and $P_3$ turned out to be, it's always a $\frac{1}{4}$ chance that the coin flips will leave us with a triangle containing the center.

{{< figure image="differentiate.png" />}}

That's very subtle. Just by reframing how we think of the random process for choosing these points, the answer $\frac{1}{4}$ popped in a different way from before.
And importantly, this style of argument generalizes seamlessly to 3 dimensions.

## Applying the shift to three dimensions

Again, instead of starting off by picking 4 random points, imagine choosing 3 random lines through the center, and then a random point for $P_4$.

{{< figure image="sphere_procedure.png" />}}

That first line passes through the sphere at 2 points, so flip a coin to decide which of those two points is $P_1$.
Likewise, for each of the other lines flip a coin to decide where $P_2$ and $P_3$ end up.

{{< figure video="3d_1.mp4" />}}

There are 8 equally likely outcomes of these coin flips, but one and only one of these outcomes will place $P_1$, $P_2$, and $P_3$ on the opposite side of the center from $P_4$.
So only one of these 8 equally likely outcomes gives a tetrahedron containing the center, meaning our final answer is $\frac{1}{8}$.

{{< pi-creature emotion="surprised" text="Isn't that elegant?">}}

Isn't that elegant?

This is a valid solution, but admittedly the way I've stated it so far rests on some visual intuition.
Here is a [more formal write-up](https://lsusmath.rickmabry.org/psisson/putnam/putnam-web.htm) of this same solution in the language of linear algebra by Ralph Howard and Paul Sisson, if you're curious.
This is common in math, where having the key insight and understanding is one thing, but having the relevant background to articulate this understanding more formally is almost a separate muscle entirely, one which undergraduate math students spend much of their time building up.

The main takeaway here is not the solution itself, after all who cares about random tetrahedra in a sphere?  Instead take not of the two key problem-solving tactics that led us to the solution, which most certainly carry over to many problems that do matter.

* Keep asking simpler versions of the question until you can get some foothold
* If some added construct proves to be useful, see if you can reframe the whole question around that new construct.
