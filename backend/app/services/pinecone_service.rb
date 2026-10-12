# app/services/pinecone_service.rb
require 'http'

class PineconeService
  def initialize
    @base_url = ENV.fetch("PINECONE_HOST").delete_suffix("/")
    @headers = {
      "Content-Type" => "application/json",
      "Api-Key" => ENV.fetch("PINECONE_API_KEY"),
      "X-Pinecone-API-Version" => "2025-04",
    }
  end

  def query(vector, top_k = 3)
    payload = {
      "vector" => vector,
      "topK" => top_k,
      "includeValues" => false,
      "includeMetadata" => true
    }

    response = HTTP.timeout(connect: 5, read: 15)
      .headers(@headers)
      .post("#{@base_url}/query", json: payload)

    if response.status.success?
      JSON.parse(response.body)
    else
      raise "Pinecone query failed with status #{response.status}"
    end
  end
end
