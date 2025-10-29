import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to CivicAid</h1>
      <p>Report issues in your community and get help from authorities and volunteers.</p>
      <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
    </div>
  );
}
