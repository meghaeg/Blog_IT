import React from 'react';
import { useState } from 'react';

function Blog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("https://blog-it-67ma.onrender.com/api/blogs/createBlog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content, category }),
    })
        .then((res) => res.json())
        .then((data) => {
            alert('Blog submitted successfully');
            setTitle('');
            setContent('');
        })
        .catch((err) => {
            console.error('Error submitting blog:', err);
            alert('Failed to submit blog');
        });
    };

    const handleBlog = (e)=>{
        e.preventDefault();
        fetch('https://blog-it-67ma.onrender.com/api/blogs/getBlog',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        })
        .then(res=>res.json())
        .then(data =>{
            alert(data.message);
        })
        .catch((err) =>{
            console.error("Failed to fetch: ",err);
            alert("Failed");
        });
    };
    
    return (
        <div>
            <h1>Welcome to the Blog Page</h1>
            <button onClick={handleBlog}>View all Blogs</button>
            <br></br><hr></hr>
            <form onSubmit={handleSubmit}>
                <h2>Create a New Blog Post</h2>
                <div>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />    
                </div>
                <div>
                    <label>Category: </label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Health">Health</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Education">Education</option>    
                        <option value="Entertainment">Entertainment</option>
                        <option value="Business">Business</option>
                        <option value="Travel">Travel</option>
                        <option value="Food">Food</option>
                        <option value="Sports">Sports</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}       
export default Blog;