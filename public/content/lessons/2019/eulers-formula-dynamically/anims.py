from manimlib.imports import *

T_COLOR = GREY
VELOCITY_COLOR = GREEN
POSITION_COLOR = BLUE
CONST_COLOR = YELLOW

Tex = TexMobject
TexText = TextMobject

class ExpGraph(GraphScene):
    CONFIG = {
        "x_axis_label": r"$t$",
        "y_axis_label": r"$f(t)$"
    }
    def construct(self):
        self.setup_axes()
        f = self.get_graph(lambda x: np.exp(0.3*x))
        lbl = self.get_graph_label(f, label="e^t")
        self.add(f, lbl)

class RotatedVectors(Scene):
    def construct(self):
        plane = ComplexPlane()
        plane.unit_size = 2.5
        plane.scale(plane.unit_size)
        plane.add_coordinates()

        self.add(plane)

        n = 12
        zs = [
            np.exp(complex(0, k * TAU / n))
            for k in range(n)
        ]
        points = map(plane.n2p, zs)
        vects = VGroup(*[
            Arrow(
                plane.n2p(0), point,
                buff=0,
                color=POSITION_COLOR,
            )
            for point in points
        ])
        vects.set_opacity(0.75)
        attached_vects = VGroup(*[
            vect.copy().shift(vect.get_vector())
            for vect in vects
        ])
        attached_vects.set_color(VELOCITY_COLOR)
        v_vects = VGroup(*[
            av.copy().rotate(
                90 * DEGREES,
                about_point=av.get_start()
            )
            for av in attached_vects
        ])

        self.play(
            LaggedStartMap(GrowArrow, vects),
        )
        self.wait()
        self.play(
            TransformFromCopy(
                vects, attached_vects,
                path_arc=20 * DEGREES,
            )
        )
        self.play(
            ReplacementTransform(
                attached_vects,
                v_vects,
                path_arc=90 * DEGREES,
            )
        )
        self.wait()


class ExpVectorField(Scene):
    def construct(self):
        plane = ComplexPlane()
        plane.unit_size = 2.5
        plane.scale(plane.unit_size)
        plane.add_coordinates()

        zero_point = plane.n2p(0)

        def func(p):
            vect = p - zero_point
            return rotate_vector(vect, 90 * DEGREES)

        vf_config = {
            # "x_min": plane.n2p(-3)[0],
            # "x_max": plane.n2p(3)[0],
            # "y_min": plane.c2p(0, -2)[1],
            # "y_max": plane.c2p(0, 2)[1],
            "max_magnitude": 8,
            "opacity": 1,
        }
        vf0 = VectorField(
            lambda p: np.array(p) - zero_point,
            length_func=lambda x: x,
            # opacity=0.5,
            **vf_config,
        )
        vf1 = VectorField(
            func,
            length_func=lambda x: x,
            # opacity=0.5,
            **vf_config,
        )
        vf2 = VectorField(
            func,
            **vf_config,
        )
        for vf in [vf0, vf1, vf2]:
            vf.submobjects.sort(
                key=lambda m: get_norm(m.get_start())
            )
        
        self.add(plane, vf2)
