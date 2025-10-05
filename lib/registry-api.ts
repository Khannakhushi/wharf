export interface RegistryConfig {
  url: string;
  username?: string;
  password?: string;
}

export interface Repository {
  name: string;
}

export interface TagsList {
  name: string;
  tags: string[];
}

export interface Manifest {
  schemaVersion: number;
  mediaType?: string;
  config?: {
    mediaType: string;
    size: number;
    digest: string;
  };
  layers?: Array<{
    mediaType: string;
    size: number;
    digest: string;
  }>;
  manifests?: Array<{
    mediaType: string;
    size: number;
    digest: string;
    platform?: {
      architecture: string;
      os: string;
      variant?: string;
    };
  }>;
}

export interface BlobMetadata {
  size: number;
  digest: string;
}

class RegistryAPI {
  private config: RegistryConfig;
  private token?: string;

  constructor(config: RegistryConfig) {
    this.config = config;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      Accept: [
        "application/vnd.oci.image.index.v1+json",
        "application/vnd.oci.image.manifest.v1+json",
        "application/vnd.docker.distribution.manifest.list.v2+json",
        "application/vnd.docker.distribution.manifest.v2+json",
        "application/vnd.docker.distribution.manifest.v1+json",
      ].join(", "),
    };

    if (this.config.username && this.config.password) {
      const auth = btoa(`${this.config.username}:${this.config.password}`);
      headers["Authorization"] = `Basic ${auth}`;
    } else if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.url}${path}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.url}/v2/`, {
        headers: await this.getAuthHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getCatalog(
    n?: number,
    last?: string
  ): Promise<{ repositories: string[] }> {
    const params = new URLSearchParams();
    if (n) params.append("n", n.toString());
    if (last) params.append("last", last);
    const query = params.toString() ? `?${params.toString()}` : "";

    return this.request<{ repositories: string[] }>(`/v2/_catalog${query}`);
  }

  async getTags(name: string, n?: number, last?: string): Promise<TagsList> {
    const params = new URLSearchParams();
    if (n) params.append("n", n.toString());
    if (last) params.append("last", last);
    const query = params.toString() ? `?${params.toString()}` : "";

    return this.request<TagsList>(`/v2/${name}/tags/list${query}`);
  }

  async getManifest(name: string, reference: string): Promise<Manifest> {
    return this.request<Manifest>(`/v2/${name}/manifests/${reference}`);
  }

  async getManifestDigest(name: string, reference: string): Promise<string> {
    const url = `${this.config.url}/v2/${name}/manifests/${reference}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      method: "HEAD",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get manifest digest: ${response.status}`);
    }

    const digest = response.headers.get("Docker-Content-Digest");
    if (!digest) {
      throw new Error("No digest header returned");
    }

    return digest;
  }

  async deleteManifest(name: string, digest: string): Promise<void> {
    const url = `${this.config.url}/v2/${name}/manifests/${digest}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Delete failed: ${response.status} ${response.statusText}`
      );
    }
  }

  async getBlobMetadata(name: string, digest: string): Promise<BlobMetadata> {
    const url = `${this.config.url}/v2/${name}/blobs/${digest}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      method: "HEAD",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get blob metadata: ${response.status}`);
    }

    const size = parseInt(response.headers.get("Content-Length") || "0");
    return { size, digest };
  }

  async downloadBlob(name: string, digest: string): Promise<Blob> {
    const url = `${this.config.url}/v2/${name}/blobs/${digest}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to download blob: ${response.status}`);
    }

    return response.blob();
  }
}

export default RegistryAPI;
