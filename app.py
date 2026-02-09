import streamlit as st
from datetime import datetime

st.set_page_config(
    page_title="OneCall Away • UK Takeaway Calls",
    page_icon="📞",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Modern CSS
st.markdown("""
<style>
    .main {background: linear-gradient(135deg, #0f172a 0%, #1e2937 100%);}
    .hero-text {font-size: 3.8rem; line-height: 1.1; font-weight: 800; color: white;}
    .card {background: rgba(255,255,255,0.95); padding: 2rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);}
    .nav {background: rgba(15,23,42,0.95); backdrop-filter: blur(10px);}
    .btn {background: #10b981; color: white; padding: 14px 32px; border-radius: 9999px; font-weight: 700;}
</style>
""", unsafe_allow_html=True)

# Navbar
st.markdown("""
<div class='nav' style='position:sticky; top:0; z-index:100; padding:1rem 0;'>
    <div style='max-width:1280px; margin:auto; display:flex; justify-content:space-between; align-items:center; padding:0 2rem;'>
        <div style='display:flex; align-items:center; gap:12px; color:white;'>
            <span style='font-size:2.2rem;'>📞</span>
            <h1 style='font-size:1.9rem; font-weight:800; margin:0;'>OneCall Away</h1>
        </div>
        <div style='display:flex; gap:2.5rem; color:white; font-weight:500;'>
            <a href='#services' style='text-decoration:none; color:inherit;'>Services</a>
            <a href='#how' style='text-decoration:none; color:inherit;'>How it Works</a>
            <a href='#pricing' style='text-decoration:none; color:inherit;'>Pricing</a>
            <a href='#contact' style='text-decoration:none; color:inherit;'>Contact</a>
        </div>
        <a href='#contact' class='btn' style='text-decoration:none;'>Get Free Quote</a>
    </div>
</div>
""", unsafe_allow_html=True)

st.markdown("<br><br>", unsafe_allow_html=True)

# Hero Section
col1, col2 = st.columns([5, 4])
with col1:
    st.markdown("<h1 class='hero-text'>Never Miss Another<br>Takeaway Order Again</h1>", unsafe_allow_html=True)
    st.markdown("### Professional UK-based inbound call centre for takeaways & restaurants")
    st.markdown("Answer every call • Boost sales by 30%+ • Focus on cooking only")
    
    st.markdown("<br>", unsafe_allow_html=True)
    c1, c2, c3 = st.columns(3)
    with c1: st.button("Get Free Quote", type="primary", use_container_width=True)
    with c2: st.button("Watch 45-sec Video", use_container_width=True)
    
    st.markdown("**✅ UK Agents • ✅ GDPR Compliant • ✅ 24/7 Coverage**")

with col2:
    st.image("https://source.unsplash.com/800x900/?callcenter,restaurant", use_column_width=True)

# Services
st.markdown("<h2 id='services' style='text-align:center; color:white; margin:4rem 0 2rem;'>Our Services</h2>", unsafe_allow_html=True)
cols = st.columns(3)
with cols[0]:
    st.markdown("<div class='card'><h3>📞 Order Taking</h3><p>Trained agents take orders, upsell drinks & sides, send straight to your kitchen.</p></div>", unsafe_allow_html=True)
with cols[1]:
    st.markdown("<div class='card'><h3>🛡️ Complaint Handling</h3><p>Professional handling so your reputation stays protected.</p></div>", unsafe_allow_html=True)
with cols[2]:
    st.markdown("<div class='card'><h3>🌙 After Hours & Weekend</h3><p>Never miss late night or busy weekend orders.</p></div>", unsafe_allow_html=True)

# How it Works
st.markdown("<h2 id='how' style='text-align:center; color:white; margin:4rem 0 2rem;'>How It Works</h2>", unsafe_allow_html=True)
cols = st.columns(4)
for i, text in enumerate(["Your number diverts to us", "UK agent answers in your name", "Order sent instantly via WhatsApp/Email", "You just cook & earn"]):
    with cols[i]:
        st.markdown(f"""
        <div style='text-align:center; background:rgba(255,255,255,0.1); padding:2rem 1rem; border-radius:20px; color:white;'>
            <div style='font-size:3rem; font-weight:900; color:#10b981;'>{i+1}</div>
            <p style='margin-top:1rem;'>{text}</p>
        </div>
        """, unsafe_allow_html=True)

# Pricing
st.markdown("<h2 id='pricing' style='text-align:center; color:white; margin:4rem 0 2rem;'>Transparent Pricing</h2>", unsafe_allow_html=True)
col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("<div class='card'><h3>Starter</h3><h2 style='color:#10b981;'>£199<span style='font-size:1rem;'>/mo</span></h2><ul><li>400 calls</li><li>Basic order taking</li></ul></div>", unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class='card' style='border:3px solid #10b981; position:relative;'>
        <div style='position:absolute; top:-12px; right:20px; background:#10b981; color:white; padding:4px 20px; border-radius:9999px; font-size:0.9rem;'>Most Popular</div>
        <h3>Professional</h3>
        <h2 style='color:#10b981;'>£399<span style='font-size:1rem;'>/mo</span></h2>
        <ul><li>Unlimited calls</li><li>Upselling + Complaints</li><li>Daily reports</li></ul>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown("<div class='card'><h3>Enterprise</h3><h2 style='color:#10b981;'>Custom</h2><ul><li>24/7 Full coverage</li><li>EPOS Integration</li></ul></div>", unsafe_allow_html=True)

# Contact Form
st.markdown("<h2 id='contact' style='text-align:center; color:white; margin:4rem 0 2rem;'>Ready to Increase Your Sales?</h2>", unsafe_allow_html=True)

with st.form("contact"):
    col1, col2 = st.columns(2)
    name = col1.text_input("Your Name *")
    email = col2.text_input("Business Email *")
    phone = col1.text_input("Phone Number")
    restaurant = col2.text_input("Takeaway/Restaurant Name *")
    message = st.text_area("Current call volume or special requirements...")
    
    if st.form_submit_button("Send Message →", type="primary"):
        if name and email and restaurant:
            st.success("✅ Thank you! We'll send your custom quote within 24 hours.")
        else:
            st.error("Please fill all required fields")

# Footer
st.markdown("---")
st.markdown("<p style='text-align:center; color:#94a3b8;'>© 2026 OneCall Away • Professional Inbound Call Centre for UK Takeaways</p>", unsafe_allow_html=True)
