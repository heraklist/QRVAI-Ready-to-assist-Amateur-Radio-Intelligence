"""P1.3 immutable stage remains testable after adding the eight Family C owners."""
from pathlib import Path
from tempfile import TemporaryDirectory
from hashlib import sha256
import unittest
from tests.p1 import test_family_b_archive as old
from scripts.p1.audit_domain_skills import audit_stage
from scripts.p1.build_staging_archive import build_review_zip, validate_review_zip

P13_SHA="50160a037c52de504676593f79fc87f12166ca019d8620a4f98e00e677eb5ceb"
class FamilyCInheritanceTests(unittest.TestCase):
    def test_inherited_52_file_baseline_is_copy_isolated(self):
        self.assertTrue(hasattr(old,"copy_family_b_baseline"),"P1.3 immutable 52-file snapshot needs copy_family_b_baseline")
        with TemporaryDirectory() as temp:
            root=old.copy_family_b_baseline(Path(temp)/"baseline")
            self.assertEqual(audit_stage(root,old.SPECS,old.OWNERS),[])
            z=build_review_zip(root,Path(temp)/"inherited-52.zip",old.SPECS,old.OWNERS)
            self.assertEqual(validate_review_zip(z,old.EXPECTED),[])
            self.assertEqual(sha256(z.read_bytes()).hexdigest(),P13_SHA)
