import streamlit as st
import plotly.express as px

st.set_page_config(page_title="PRISM Dashboard", layout="wide")

st.title("PRISM – Project Manager Dashboard (Demo)")

col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Projects", 1)
col2.metric("High Risk", "0%")
col3.metric("Avg Expected Delay", "6.0 mo")
col4.metric("Avg Overrun", "₹115 Cr")

st.subheader("Feature Importance")
fig = px.bar(x=[30, 22, 18, 15, 9, 6], y=["Vendor Reliability", "Budget Size", "Weather Impact", "Complexity", "Material Availability", "Labour Cost"], orientation='h')
st.plotly_chart(fig, use_container_width=True)
