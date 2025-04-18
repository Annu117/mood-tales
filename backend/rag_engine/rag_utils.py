# rag_engine/rag_utils.py
import requests
from bs4 import BeautifulSoup
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

def fetch_stories():
    urls = [
        "https://www.talesofpanchatantra.com/",
        "https://www.indiaparenting.com/stories/",
        "https://www.templepurohit.com/vedic-vaani/hindu-mythology-stories/",
        "https://www.kidsgen.com/fables_and_fairytales/indian_mythology_stories/",
        "https://www.ancient-origins.net/myths-legends",  
        "https://www.worldoftales.com/", 
        "https://mythopedia.com/",  
        "https://www.kidsgen.com/fables_and_fairytales/african_folk_tales/"
    ]
    
    stories = []
    for url in urls:
        try:
            res = requests.get(url, timeout=5)
            if res.status_code == 200:
                soup = BeautifulSoup(res.text, "html.parser")
                extracted = [p.text.strip() for p in soup.find_all("p")[:7]]
                stories.extend(extracted)
        except requests.exceptions.RequestException:
            continue
    return "\n".join(stories)

def prepare_documents(raw_text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    return splitter.split_documents([Document(page_content=raw_text)])
