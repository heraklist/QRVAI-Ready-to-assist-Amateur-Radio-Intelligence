"""P1.5 must preserve the 21-owner P1.4 review ZIP after staging Family D."""
from hashlib import sha256
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from tests.p1 import test_family_c_archive as inherited
from scripts.p1.audit_domain_skills import audit_stage
from scripts.p1.build_staging_archive import build_review_zip,validate_review_zip

P14_SHA = "344b7e7806406738a495d52554d686c27edf2c21c039ea66159943f18fc1076f"

class FamilyDInheritanceTests(unittest.TestCase):
    def test_p14_84_zip_copy_unchanged_with_family_d(self):
        self.assertTrue(hasattr(inherited,"copy_family_c_baseline"),
                        "Need copy_family_c_baseline to preserve prior 84-file source snapshot")
        with TemporaryDirectory() as temp:
            d=Path(temp)
            source=inherited.copy_family_c_baseline(d/"prior")
            self.assertEqual(audit_stage(source,inherited.SPEC,inherited.CUMULATIVE),[])
            archive=build_review_zip(source,d/"p14.zip",inherited.SPEC,inherited.CUMULATIVE)
            self.assertEqual(validate_review_zip(archive,inherited.SOURCE_PATHS),[])
            self.assertEqual(sha256(archive.read_bytes()).hexdigest(),P14_SHA)
