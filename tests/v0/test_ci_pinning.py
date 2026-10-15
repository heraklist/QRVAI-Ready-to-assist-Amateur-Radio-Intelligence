"""Prevent mutable third-party GitHub Actions tags in V0 verification."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]

class TestCIPinning(unittest.TestCase):
    def test_all_v0_third_party_actions_use_immutable_commit_sha(self):
        workflow = (ROOT / ".github/workflows/v0-ci.yml").read_text(encoding="utf-8")
        actions = re.findall(r"^\s*- uses:\s+(actions/[\w-]+)@([^\s#]+)", workflow, re.MULTILINE)
        self.assertEqual(len(actions), 3)
        for action, revision in actions:
            with self.subTest(action=action):
                self.assertRegex(revision, r"^[0-9a-f]{40}$")
