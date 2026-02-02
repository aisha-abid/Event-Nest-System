import bcrypt from "bcryptjs";

const test = async () => {
  const plain = "112233";

  // Step 1: Hash generate
  const hash = await bcrypt.hash(plain, 10);
  console.log("New Hash:", hash);

  // Step 2: Compare test
  const match = await bcrypt.compare(plain, hash);
  console.log("Match?", match);
};

test();
