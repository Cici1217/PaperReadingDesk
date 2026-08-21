import unittest

from server import _complete_visual_vertical_bounds


class CompleteVisualVerticalBoundsTests(unittest.TestCase):
    def test_unknown_layout_keeps_entire_caption_band(self) -> None:
        self.assertEqual(
            _complete_visual_vertical_bounds(500, 530, 100, 700, 800),
            (104, 695),
        )

    def test_visual_above_caption_keeps_conservative_upper_band(self) -> None:
        self.assertEqual(
            _complete_visual_vertical_bounds(
                500, 530, 100, 700, 800,
                [{"x": 80, "y": 300, "w": 400, "h": 160}],
            ),
            (104, 542),
        )

    def test_visual_below_caption_keeps_conservative_lower_band(self) -> None:
        self.assertEqual(
            _complete_visual_vertical_bounds(
                200, 230, 100, 700, 800,
                [{"x": 80, "y": 260, "w": 400, "h": 160}],
            ),
            (188, 695),
        )

    def test_ambiguous_evidence_keeps_entire_caption_band(self) -> None:
        self.assertEqual(
            _complete_visual_vertical_bounds(
                300, 340, 100, 700, 800,
                [{"x": 80, "y": 320, "w": 400, "h": 120}],
            ),
            (104, 695),
        )

    def test_known_visual_outranks_incorrect_neighbour_boundary(self) -> None:
        top, bottom = _complete_visual_vertical_bounds(
            500, 530, 360, 700, 800,
            [{"x": 80, "y": 300, "w": 400, "h": 160}],
        )
        self.assertLessEqual(top, 288)
        self.assertGreaterEqual(bottom, 542)


if __name__ == "__main__":
    unittest.main()
