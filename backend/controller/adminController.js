const { PrismaClient } = require("@prisma/client");
const { decryptLink } = require("../utils/link-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const prisma = new PrismaClient();

async function getUserVoteCount(sid) {
  try {
    // Find the user by their sid and count the number of names they have voted for
    const user = await prisma.user.findUnique({
      where: { sid: parseInt(sid) }, // sid is assumed to be an integer
      select: {
        _count: {
          select: { votes: true } // Count the number of votes (names the user has voted for)
        }
      }
    });

    // If user not found, return a vote count of 0
    if (!user) {
      return 0;
    }

    // Return the number of votes the user has cast
    return user._count.votes;

  } catch (error) {
    console.error('Error retrieving user vote count:', error);
    throw new Error('Server error while retrieving vote count');
  }
}

async function verifyLink(req, res) {
  const User = prisma.user;

  const link = req.params.link;

  // console.log("link", link);

  // console.log(decryptLink(link));
  const { sid, email, password } = decryptLink(link);

  if (!sid || isNaN(sid) || !Number.isInteger(+sid)) {
    return res.status(400).json({
      success: false,
      message: "Not verified",
    });
  }

  // console.log(sid, email, password);
  //  decrypted_info  {
  //     sid: '2015030',
  //     email: '2015030@urp.buet.ac.bd',
  //     password: '4346944891dc2c0c'
  //   }

  const user = await User.findUnique({
    where: {
      sid: +sid,
      email: email,
      password:password
    }
  });

  if (!user) {
    return res.json({
      success: false,
      message: "Not verified",
    });
  }

  //user has been authenticated

  console.log(user);

  const token = jwt.sign(
    {
      sid: user.sid,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET, // Make sure this secret is securely stored in your environment variables
    { expiresIn: "2h" } // Token will expire in 2 hours
  );

  // we need to include another field in the response
  
  const voteCount = await getUserVoteCount(sid);

  console.log(sid,"has cast",voteCount,"votes");

  // Send the token in the response body
  return res.status(200).json({
    success: true,
    token: token, // Sending the token here
    isAdmin: user.isAdmin,
    count:voteCount
  });
}

async function authenticate(req,res,next){
    console.log("Authenticating",req.headers.token);

    const token = req.headers['token'];

  // If the token is missing, respond with an error
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token missing from headers',
    });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded fields (sid, email, isAdmin) to the req object
    req.user = {
      sid: decoded.sid,
      email: decoded.email,
      isAdmin: decoded.isAdmin
    };

    // Call next to pass control to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = {
  verifyLink,
  authenticate
};
