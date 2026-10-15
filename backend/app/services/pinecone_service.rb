# app/services/pinecone_service.rb
require 'http'
require 'uri'

class PineconeService
  def initialize
    @base_url = normalize_host(ENV.fetch("PINECONE_HOST"))
    @namespace = ENV.fetch("PINECONE_NAMESPACE", "complaints")
    @headers = {
      "Content-Type" => "application/json",
      "Accept" => "application/json",
      "Api-Key" => ENV.fetch("PINECONE_API_KEY"),
      "X-Pinecone-API-Version" => "2025-10",
    }
  end

  def search(text, top_k = 3)
    payload = {
      "query" => {
        "inputs" => { "text" => text },
        "top_k" => top_k
      },
      "fields" => %w[text issue sub_issue product tags]
    }

    response = HTTP.timeout(connect: 5, read: 15)
      .headers(@headers)
      .post(search_url, json: payload)

    if response.status.success?
      JSON.parse(response.body)
    else
      raise "Pinecone search failed with status #{response.status}"
    end
  end

  private

  def normalize_host(host)
    value = host.to_s.strip.delete_suffix("/")
    value.start_with?("http://", "https://") ? value : "https://#{value}"
  end

  def search_url
    namespace = URI.encode_www_form_component(@namespace)
    "#{@base_url}/records/namespaces/#{namespace}/search"
  end
end
