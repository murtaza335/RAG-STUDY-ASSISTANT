from chromadb.utils import embedding_functions

class HybridRetriever:
    def __init__(self, collection, embed_model, semantic_weight=0.7, keyword_weight=0.3, top_k=5):
        self.collection = collection
        self.embed_model = embed_model
        self.semantic_weight = semantic_weight
        self.keyword_weight = keyword_weight
        self.top_k = top_k

    def retrieve(self, query: str):
        # ---- Semantic search ----
        query_embedding = self.embed_model([query])[0]
        semantic_results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=self.top_k * 2   # get extra candidates
        )

        # ---- Keyword search ----
        keyword_results = self.collection.query(
            query_texts=[query],
            n_results=self.top_k * 2
        )

        # ---- Merge results ----
        scores = {}
        
        # semantic scoring
        for doc, score in zip(semantic_results["documents"][0], semantic_results["distances"][0]):
            scores[doc] = scores.get(doc, 0) + self.semantic_weight * (1 - score)  # convert distance → similarity

        # keyword scoring
        for doc, score in zip(keyword_results["documents"][0], keyword_results["distances"][0]):
            scores[doc] = scores.get(doc, 0) + self.keyword_weight * (1 - score)

        # sort by combined score
        ranked_docs = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        return [doc for doc, _ in ranked_docs[:self.top_k]]
