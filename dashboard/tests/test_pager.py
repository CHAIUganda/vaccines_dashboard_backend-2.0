from unittest import TestCase

from dashboard.helpers import Pager


class TestPager(TestCase):
    def test_get_data(self):
        test_cases = [{"page": 1, "count": 2, "expected": [1, 2]},
                      {"page": 2, "count": 2, "expected": [3, 4]},
                      {"page": "2", "count": "2", "expected": [3, 4]},
                      {"page": 3, "count": 2, "expected": [5, 6]},
                      {"page": 4, "count": 2, "expected": [7, 8]},
                      {"page": 3, "count": 3, "expected": [7, 8]},
                      {"page": None, "count": None, "expected": [1, 2, 3, 4, 5, 6, 7, 8]},
                      {"page": 40, "count": 3, "expected": []}]
        for case in test_cases:
            pager = Pager([1, 2, 3, 4, 5, 6, 7, 8], page=case['page'], page_count=case['count'])
            self.assertEqual(pager.get_data(), case['expected'])
