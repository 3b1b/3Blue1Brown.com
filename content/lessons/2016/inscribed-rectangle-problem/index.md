---
title: Who cares about topology? (Inscribed rectangle problem)
description: An unsolved problem, a very elegant solution to a weaker version of the problem, and a little bit on what topology is and why people care.
date: 2016-11-04
video: AmgkSdhK4K8
source: _2016/wcat.py
credits:
- Lesson by Grant Sanderson
- Blog adaptation by Josh Pullen
---

When I was a kid, since I loved math and sought out mathy things, I would occasionally find myself at some talk or seminar where people wanted to get the youth excited about the things mathematicians care about.

A common go-to topic to excite our imaginations was topology. We might be shown something like a Möbius strip, maybe building it out of construction paper by twisting a rectangle and gluing its ends. “Look,” we’d be told as we were asked to draw a line along the surface, “it’s a surface with just one side!”

{{< figure image="mobius-strip.png" />}}

Or we might be told that topologists view a coffee mug and a doughnut as the same thing, since each has one hole.

{{< figure video="mug-to-torus.mp4">}}
Animation heavily inspired by [that of Lucas Vieira](https://commons.wikimedia.org/wiki/File:Mug_and_Torus_morph.gif).
{{< /figure >}}

But these kinds of demos always left a lurking question: **How is this math? How does any of this actually help solve problems?**

It wasn’t until I saw the problem I’m about to show you, with its elegant and surprising solution, that I started to understand why mathematicians actually care about some of these shapes and the properties they have.

{{< section >}}

# The Inscribed Square Problem
No one knows the answer to the following question:
> If you have a closed curve in 2D space, will you always be able to find four points on this curve that make up a square?

This is known as the Toeplitz' conjecture. By "closed curve", we mean you squiggle some line through space in a potentially crazy way and end at the point where you started.

{{< figure image="inscribed-square.png" >}}
We can find four points on *this* closed loop that form a square. But can we do the same for *any* loop?
{{< /figure >}}

If your closed loop is a circle, for example, it’s quite easy to find an inscribed square. Infinitely many squares, in fact. If your loop was an ellipse, it’s still pretty easy to find an inscribed square.

{{< figure image="circle-and-ellipse.png" >}}
Finding inscribed squares in circles and ellipses is easy. But what about other, wilder loops?
{{< /figure >}}

This tweet shows a bunch of crazy loops, and at every frame there is indeed a square inscribed inside:

{{< tweet 1390169453346787329 >}}

This problem has been solved for some special cases, for example curves which are *smooth*[^1] are known to always contain inscribed squares. However, the general case where the only assumption you make is that the curve is continuous, which includes much wilder curves like fractals, remains unsolved.

{{< section >}}
# The Inscribed Rectangle Problem
To me it’s fascinating that the current tools of math can neither confirm nor deny the existence of a loop that has no inscribed square. But what about a slightly weaker question? Can we prove that any closed continuous curve always has an inscribed *rectangle*?

{{< figure image="inscribed-rectangle.png" />}}

It’s still pretty hard, but there is a beautiful solution that might actually be my favorite piece of math. We start with a seemingly trivial shift in perspective. Instead of asking whether we can find four points forming a rectangle, we ask whether it’s possible to find two distinct pairs of points which form a rectangle.

{{< figure image="pairs-of-points.png" >}}
Considering the points as diagonal pairs makes the problem easier.
{{< /figure >}}

We’ll use the following key fact about rectangles: If you label the vertices of a rectangle $a$, $b$, $c$, and $d$, then the distance between $a$ and $c$ equals the distance between $b$ and $d$, and the midpoint of $a$ and $c$ is the same as the midpoint of $b$ and $d$.

{{< figure image="rectangle-properties.png" width="500px" >}}
A rectangle with points labeled $a$, $b$, $c$, and $d$.
{{< /figure >}}

In fact, any time you have two separate pairs of points in space, $(a, c)$ and $(b, d)$, if you can guarantee that they share a midpoint, and the distance between $a$ and $c$ equals the distance between $b$ and $d$, it’s enough to guarantee that these four points make up a rectangle.

So what we’re going to do is try to prove that for *any* closed loop it’s possible to find two distinct pairs of points on that loop that share a midpoint, and which are the same distance apart.

Take a moment to make sure that idea is clear: **We’re finding two distinct pairs of points on the loop with a common midpoint, and which are the same distance apart.**

Why is this a useful reframing? As you’ll see, it lets us phrase the question in terms of surfaces and properties of those surfaces.

If you were to encode the important information about a pair of points, it would involve three numbers: Two to describe the midpoint, and one more to specify the distance. To a mathematician, if you are describing something with three numbers, it’s very enticing to think of it as a single point in 3D space.

{{< figure image="encode-in-3d.png" >}}
We want to encode the three important pieces of information about a pair of points as a single point in 3D space.
{{< /figure >}}

Consider our closed loop to be sitting on the xy-plane in 3D space. For a given pair of points, label their midpoint $M$, which will be somewhere on the xy-plane. If the distance between them is $d$, then plot the point which is exactly $d$ units above the point $M$ in the z direction.

This defines a function that takes in a pair of points on the loop, and outputs a single point in 3D space. It’s kind of like a graph, but be mindful of the difference. We’re **not** describing a function that takes in a pair of numbers $(x, y)$ and spits out one number $z$.  What we’re dealing with is a much richer function which takes in a pair of points on the loop and spits out a triplet $(x, y, z)$.

{{< figure image="3d-point-example.png" >}}
For any pair of points on the loop (pink) we have an associated point in 3D space (blue).
{{< /figure >}}

As you do this for many possible pairs of points, you’ll effectively be drawing through 3D space. When you do it for *all possible* pairs of points on the loop, you will draw some kind of surface above the plane.

{{< figure image="drawing-3d-surface.png" video="drawing-3d-surface.mp4" >}}
By finding the 3D points associated with every possible pair of two points on the loop, we have created a surface!
{{< /figure >}}

{{< question
  question="If we choose two points on the loop with (x, y) coordinates of (1, 2) and (1, 4), what is the corresponding point in 3D space based on the function we’ve defined?"
  choice1="(1, 3, 6)"
  choice2="(1, 3, 2)"
  choice3="(2, 6, 6)"
  choice4="(2, 6, 2)"
  correct=2
  explanation="The midpoint is (1, 3), and the points are a distance of 2 apart, so the z coordinate is 2. That means the final point in 3D space is (1, 3, 2)."
>}}

Notice how the 3D surface ends up perfectly touching the 2D loop, rather than hovering above it in 3D space or something like that. This will actually be important later, so let’s think about why it happens.

{{< pi-creature emotion="confused" text="Why does the surface hug the curve?" thought="true" >}}

Consider what happens when we choose two points on the loop which are close together. As the pair of points on the loop gets closer and closer, the plotted point gets lower, since its height is by definition equal to the distance between the points. Also, the midpoint gets closer and closer to the loop as the points approach each other.

{{< figure image="points-approach-x.png" video="points-approach-x.mp4" >}}
As the points on the loop (pink) approach a single point $X$, the point in 3D space (blue) also approaches $X$.
{{< /figure >}}

When the two points eventually coincide at a single point $X$, the corresponding point on the 3D surface will also be $X$. That is, $f(X, X) = X$. This fact is the reason why the surface hugs the loop, rather than floating above it.

Another important fact is that this function is continuous, which means that if you slightly adjust a given pair of points, the corresponding output in 3D space is only slightly adjusted as well.[^2] There is never a sudden, discontinuous jump.

**Our goal, then, is to show that this function has a collision; that two distinct pairs of points each map to the same spot in 3D space.** The only way for that to happen is if they share a common midpoint, and if their distance $d$ apart from each other is the same.

So in some sense, finding an inscribed rectangle comes down to showing that this surface must intersect itself. That’s an admittedly ill-defined phrasing, but we can make it more precise if we find a new geometric representation for the pairs of points on the loop as a surface, and think of the mapping above as a way of embedding that new surface into 3D-space, hopefully with a forced self-intersection along the way.

**Stop to think:** Why does the surface intersecting itself tell us that there is a rectangle inscribed in the original loop?

**Answer:** {{< spoiler >}}If the surface intersects itself, it means that two different pairs of points both map to the same point in 3D space. Based on the way we’ve defined our surface, this means that both pairs have the same midpoint and the same distance apart. Therefore, we have a rectangle!{{< /spoiler >}}

{{< section >}}
## A New Way to Think About Pairs of Points
Think about how we represent pairs of real numbers using individual points on a two-dimensional coordinate plane. Analogous to this, we’ll seek out a certain 2D surface which naturally represents all pairs of points on a loop.

Now, when I say "pair of points", there are two things I could be talking about: The first is ordered pairs of points, where the pairs $(a, b)$ and $(b, a)$ would be considered distinct; that is, there’s some notion of which point is "first".

{{< figure image="ordered-pairs.png" />}}

The second is unordered pairs of points, where $\\{a, b\\}$ and $\\{b, a\\}$ would be considered the same thing. Where all that matters is what the points are, and it doesn’t matter which one is first.

{{< figure image="unordered-pairs.png" />}}

Ultimately we want to understand *unordered* pairs of points, but to get there we need to start by thinking about ordered pairs.

{{< section >}}
### Ordered Pairs As a Surface
We’ll start by straightening out the loop, cutting it at some point and deforming it into an interval. For the sake of having some labels, let’s say this is the interval on the number line from $0$ to $1$.

{{< figure image="deform-loop-to-line.png" video="deform-loop-to-line.mov" show="video" >}}
Every point on the loop maps to a single number between 0 and 1 (with one exception).
{{< /figure >}}

By following where each point ends up, every point on the loop corresponds with a unique number on this interval... except for the point where the cut happened, which corresponds simultaneously to both endpoints of the interval, meaning the numbers $0$ and $1$.

This mapping allows us to turn any pair of two points on the loop into a pair of two numbers between $0$ and $1$, which is much easier to reason about.

{{< figure image="point-pair-to-numbers.png" >}}
Every point on the loop corresponds to a number between $0$ and $1$. So a pair of points on the loop corresponds to a pair of numbers between $0$ and $1$.
{{< /figure >}}

We can place one of the two values on a new y-axis, using a second interval, so that each pair of values between $0$ and $1$ (and thus each pair of points on the loop) is associated with a single point in a $1 \times 1$ square.

{{< figure image="pair-to-square.png" >}}
By giving each of the two numbers (corresponding to our original two points on the loop) a unique axis to live on, we can represent any pair of points on the loop with a single point in a $1 \times 1$ square of 2D space.
{{< /figure >}}

Remember, we’re trying to find a surface that naturally represents the set of all pairs of points on the loop. This square is the first step to doing that.

**Stop to think:** If you have a pair of points on the loop, how do you find the corresponding point on the square?

**Answer:** {{< spoiler >}}This assumes you've already chosen a parameterization of the loop, meaning a continuous way to associate individual points with numbers between 0 and 1. From there, consider the numbers associated with the two points as the x and y coordinates in the square.{{< /spoiler >}}

The problem is that there’s some ambiguity when it comes to the edges of this square. Remember, the endpoints $0$ and $1$ on the interval really correspond to the same point of the loop, so they need to be glued together if we are to faithfully map back to the loop.

So all the points on the left edge of the square really represent the same pair of points on the loop as the corresponding coordinates on the right edge of the square. If this square is going to represent pairs on the loop in a unique way, we’ll need to glue this left edge to the right edge.

Likewise, the bottom edge needs to be glued to the top edge, since the y-coordinates of $0$ and $1$ each really represent the same second point in a given pair of points on the loop.

Let’s mark each edge with some arrows to remember how the edges should be lined up:

{{< figure image="square-alignment-arrows.png" >}}
Matching points along opposite edges of the square both correspond to the same pair of points on the loop. To represent this faithfully, we need to glue together the edges of the square as indicated by the arrows.
{{< /figure >}}

If you bend this square to perform the gluing, first rolling it into a cylinder to glue the left and right edges, then gluing the ends of the cylinder, which represent the top and bottom edges, we get a torus, the surface of a doughnut.

{{< figure image="roll-into-torus.png" video="roll-into-torus.mp4" >}}
When the square is wrapped up and its edges glued together following the arrows, it becomes a torus.
{{< /figure >}}

By gluing together the corresponding edges, we’ve solved the problem of duplicate mappings. Every individual point on this torus corresponds to a *unique* pair of points on the closed loop, and likewise every pair of points on the loop corresponds to a unique point on the torus.

The torus is to pairs of points on the loop as the xy-plane is to pairs of points on the real number line.

{{< figure image="torus-and-loop-correspondence.png" >}}
The torus serves as a 2D surface for encoding pairs of positions on a loop, much like how the xy-plane encodes pairs of positions on the number line.
{{< /figure >}}

The key property of this association is that it’s continuous both ways, meaning if you nudge any point on the torus by just a tiny amount, it corresponds to only a slight nudge in the pair of points on the loop, and vice versa.

{{< question
  question="What does a single point on the torus correspond to?"
  choice1="A unique point on the loop"
  choice2="A unique ordered pair of points on the loop"
  choice3="A unique unordered pair of points on the loop"
  choice4="A unique pair of points in the xy-plane"
  correct=2
>}}

Now we’re really getting into the heart of what topology is all about. By representing a set of things we care about, like pairs of points on a loop, as individual points on a surface, we can begin tackling our original question by understanding various properties of this surface. But the torus is not *quite* the surface that you and I care about today.

{{< section >}}
### Unordered Pairs As a Surface
If the torus is the natural shape for *ordered* pairs of points on the loop, what’s the natural shape for *unordered* pairs?

Remember, the whole reason we’re doing this is to show that two distinct pairs of points on the loop share a midpoint and are the same distance apart.  But if we consider the pair $(a, b)$ to be distinct from $(b, a)$, that would give us two separate pairs which trivially have the same midpoint and distance apart! That’s like saying you can always find a rectangle as long as you consider any pair of points to be a rectangle. Not helpful!

To find a surface representing *unordered* pairs, let’s look back at our unit square. We want the coordinates $(0.2, 0.3)$, say, to represent the same pair as $(0.3, 0.2)$. In general the coordinates $(x, y)$ should represent the same thing as $(y, x)$.

{{< figure image="matching-points.png" >}}
Since we’re interested in unordered pairs, the points $(x, y)$ and $(y, x)$ on the square both represent the same pair of points on the loop.
{{< /figure >}}

Once again, we capture this idea by gluing points together when they’re supposed to represent the same pair, which in this case requires folding the square diagonally.

{{< figure image="fold-square.png" video="fold-square.mov" >}}
Points on opposite sides of the diagonal line both correspond to the same pair of points on the loop, so we fold the square in half to prevent duplication.
{{< /figure >}}

Notice this diagonal line. It represents all pairs that look like $(X, X)$, meaning the "pairs" which are really just a single point on the loop written twice. Right now it’s marked with a red line, and you should remember it; it will become important later to know where all the pairs like $(X, X)$ live.

We now need to glue together this bottom edge with the right edge, but the orientation with which we do this is important. Points towards the left of the bottom edge have to be glued to points towards the bottom of the right edge, and points towards the right of the bottom edge have to be glued to points towards the top of the right edge.

{{< figure image="pre-mobius-arrows.png" >}}
We need to glue the bottom and right edges as indicated by the blue arrows.
{{< /figure >}}

It’s weird to think about, right?

Sometimes we must take a step back before we can progress forward. The clever trick here is to make a new diagonal cut, which of course we need to remember to glue back together at some point.

{{< figure image="cut-triangle.png" >}}
We cut the triangle in half (yellow) to gain some maneuverability. Don’t worry; we’ll glue it back together soon.
{{< /figure >}}

This frees us up to flip the bottom triangle around to the right and glue the blue edges like so...

{{< figure image="rotate-and-snap.png" video="rotate-and-snap.mp4" />}}

Now notice the orientation of the yellow arrows here: To glue back what we just cut, we don’t simply connect the edges of this rectangle to get a cylinder. We have to make a twist! Doing this in 3D space, the shape we get is a Möbius strip.

{{< figure image="mobius-strip.png" >}}
Connecting the yellow edges of the square requires a twist, which gives us a Möbius strip!
{{< /figure >}}

Isn’t that awesome!? Evidently the surface which represents all possible unordered pairs of points on a loop is the Möbius strip! The Möbius strip is to unordered pairs of points on a loop what the xy-plane is to ordered pairs of real numbers. This totally blew my mind when I first saw it.

{{< pi-creature emotion="dance_kick" >}}

And notice, the red edge of this strip, which was originally the diagonal fold in the square, represents the pairs of points that look like $(X, X)$; those which are really just a single point listed twice.

Stepping back, remember that we had defined a special kind of graph in 3D space, where the loop was sitting in the xy-plane. For each pair of points, you consider their midpoint $M$ on the xy-plane, and their distance apart, $d$, then you plot a point which is exactly $d$ units above $M$.

Because of the continuous 1-to-1 association between points on the Möbius strip and pairs of points on the loop, there’s a natural map from the Möbius strip to this surface in 3D space: For every point on the Möbius strip, consider the pair of points on the loop it corresponds to. Then plug that pair of points into our special function.

{{< figure image="mobius-maps-to-surface.png" >}}
Points on the Möbius strip correspond to pairs of points on the loop which correspond to points on the 3D surface.
{{< /figure >}}

These two mappings combined give us a way to map points on the Möbius strip directly to points on the 3D surface. But what does this mapping look like, visually? Which points on the Möbius strip map to which points on the 3D surface?

To get a hint, consider the pairs of points $(X, X)$. Where do these points fall on the Möbius strip, and where do they fall on the 3D surface?

**Answer:** {{< spoiler >}}Pairs like $(X, X)$ correspond to points on the red edge of the Möbius strip. And for the 3D surface, the corresponding points are exactly on the loop. So when the Möbius strip is mapped onto this surface, it must be done in such a way that the edge of the strip maps onto the loop in the xy-plane.{{< /spoiler >}}

{{< figure video="map-strip-to-surface.mov" >}}
Here we take the original Möbius strip and stretch it in all kinds of wonky ways so that every point on the Möbius strip aligns with its corresponding point on the 3D surface. The red edge of the Möbius strip aligns with the original loop in the xy-plane.
{{< /figure >}}

Now, if you think about it for a moment, considering the strange shape of the Möbius strip, there’s no way to glue its edge onto something two-dimensional without forcing the strip to intersect itself.

Since each point of the Möbius strip represents a pair of points on the loop, if the strip intersects itself, it means at least two distinct pairs of points correspond to the same output on this surface.  This, in turn, means they share a midpoint and are the same distance apart, which implies that these two distinct pairs of points form a rectangle!

And that’s the proof!

{{< section >}}

# So Who Cares About Topology?
But of course, we haven’t *really* completed the proof. Our intuitive sense that the edge of the Möbius strip can’t be glued down to a 2D plane isn’t rigorous; it’s just something that *seems* true.

Perhaps you make a Möbius strip out of paper. No matter how you flex and bend the Möbius strip, placing the entire edge onto the surface of your table just isn’t going to work. But how do we prove that fact mathematically? How do we translate the intuitively, physically obvious into a mathematical model we can reason about formally?

If you try to prove that it’s impossible to flatten the edge of a Möbius strip into a 2D plane, you may stumble across the Sudanese Möbius band, which *does* in fact do just that! It’s a Möbius strip where the edge forms a perfect 2-dimensional circle.

{{< figure image="sudanese-mobius-band.png" >}}
The Sudanese Möbius band is one example of a Möbius strip with its edge embedded perfectly in a 2D plane. This seemed impossible, but our intuition was wrong! ([Image by Maksim](https://en.wikipedia.org/wiki/File:MobiusSnail2B.png), distributed under a CC BY-SA 3.0 license)
{{< /figure >}}

(For a clearer view of the Sudanese Möbius band, check out [this video](https://vimeo.com/286360639) by Charles Gunn.)

So our intuition, that the edge of a Möbius strip cannot exist in a 2D plane without self-intersection, was actually wrong! The important distinction, though, is that in the case of the Sudanese Möbius band, the surface dips both above and below the 2D plane, which is not the case in our original problem, where we were limited to points on or above the xy-plane.

Let’s get a little more precise.  How would you phrase what fact we want to be true of the Möbius strip?

**Possible Answer:** {{< spoiler >}}Any continuous mapping from the Möbius strip into the half 3D space where the $z \ge 0$ which maps the boundary of the Möbius strip to the $xy$-plane must have two inputs which map to the same output. (More fancifully, such a mapping cannot be injective.){{< /spoiler >}}

If you understand the desire to turn your spatial intuitions into a rigorous air-tight line of reasoning, you understand the spirit of true topology. There is a popular conception of topology as a kind of rubber-sheet-geometry, where mathematicians dream up strange surfaces and spaces which they consider the same when you can stretch or morph one into the other without tearing it or gluing.

This is... well... kind of true, but it says nothing about why we’d care. The torus and Möbius strip arose for us as a way to represent and rephrase a completely separate non-topological problem. The mental picture of morphing without tearing or gluing is a way to conceptualize the idea of continuous one-to-one associations.

If you’re curious about which ideas from topology are useful to this problem, there are numerous theorems about which surfaces can and cannot be embedded into 3D space. While it’s possible to represent the Möbius strip and the torus in three-dimensions, there are other surfaces, like the Klein bottle[^3], which can only live in four or more dimensions, unless you allow for self-intersection.

It turns out that gluing the edge of a Möbius strip to the edge of a disk gives us a surface which is topologically equivalent to something called the "real projective plane". So the surface we defined above for the inscribed rectangle problem, combined with the interior of the closed loop on the plane which it hugs, might be described by a mathematician as an embedding of the real projective plane into 3D space. And as you may have guessed, those mathematicians are a clever bunch, and they proved that you can’t have such an embedding. That is to say, trying to jam this surface into 3D space forces it to intersect itself.

If you're itching to understand _why_ this is true, wonderful! Consider this an excuse to start digging more into topology. Facts about which surfaces are topologically distinct from others, and how many dimensions they can live in, can be surprisingly hard to formalize and prove. But if you understand this proof sketch to the inscribed rectangle problem, you'll understand how these kinds of facts are more than mere idle ponderings.

[^1]: A curve is considered "smooth" if it has a derivative.  Intuitively, a smooth curve is one that will look approximately like a line if you zoom in enough at any point. In fact, the Toeplitz conjecture has also been proved for piecewise smooth curves, which are ones made out of finitely many smooth pieces. These are essentially all the curves you could ever actually draw.

[^2]: Slightly more formally, for any input (A, B) with output P, and for any ball centered at P with radius epsilon, you can find a sufficiently small range around both A and B such that wiggling those inputs within their confined ranges keeps the output inside that ball with radius epsilon.

[^3]: A Klein bottle can be constructed with a similar cutting-and-gluing procedure that arose naturally for us in getting the torus and Möbius strip.
