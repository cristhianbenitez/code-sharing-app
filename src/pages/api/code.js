export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Here you would typically save the code to a database
    // For now, we'll just echo it back
    const { code } = req.body;
    res.status(200).json({ success: true, code });
  } else {
    // GET request would typically load code from a database
    res.status(200).json({ code: '// Write your code here' });
  }
}
