"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { StatsCard } from "@/components/stats-card";
import { RegistryConfig } from "@/components/registry-config";
import { RegistryList, Registry } from "@/components/registry-list";
import { RepositoryList } from "@/components/repository-list";
import { TagsView } from "@/components/tags-view";
import { ManifestView, ManifestData } from "@/components/manifest-view";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import RegistryAPI from "@/lib/registry-api";
import {
  Database,
  AlertCircle,
  Container,
  Package,
  Tag,
  Layers,
  Server,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "wharf_registries";

export default function Home() {
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [apis, setApis] = useState<Map<string, RegistryAPI>>(new Map());
  const [repositories, setRepositories] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [manifest, setManifest] = useState<ManifestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<string>("tags");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRegistries(
          parsed.map((r: Registry) => ({
            ...r,
            connected: false,
            loading: false,
          }))
        );
      } catch (e) {
        console.error("Failed to parse stored registries", e);
      }
    } else {
      const envUrl = process.env.NEXT_PUBLIC_REGISTRY_URL;
      const envUsername = process.env.NEXT_PUBLIC_REGISTRY_USERNAME;
      const envPassword = process.env.NEXT_PUBLIC_REGISTRY_PASSWORD;

      if (envUrl) {
        const id = `${envUrl}-env`;
        const envRegistry: Registry = {
          id,
          url: envUrl,
          username: envUsername,
          password: envPassword,
          connected: false,
          loading: false,
        };
        const toSave = [
          {
            id: envRegistry.id,
            url: envRegistry.url,
            username: envRegistry.username,
            password: envRegistry.password,
          },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        setRegistries([envRegistry]);
      }
    }
  }, []);

  useEffect(() => {
    const envUrl = process.env.NEXT_PUBLIC_REGISTRY_URL;
    if (envUrl && registries.length > 0) {
      const envRegistry = registries.find((r) => r.id === `${envUrl}-env`);
      if (envRegistry && !envRegistry.connected && !envRegistry.loading) {
        handleConnect(envRegistry.id);
      }
    }
  }, [registries]);

  const saveToStorage = (regs: Registry[]) => {
    const toSave = regs.map((r) => ({
      id: r.id,
      url: r.url,
      username: r.username,
      password: r.password,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const handleAddRegistry = (
    url: string,
    username?: string,
    password?: string
  ) => {
    const id = `${url}-${Date.now()}`;
    const newRegistry: Registry = {
      id,
      url,
      username,
      password,
      connected: false,
      loading: false,
    };

    const updated = [...registries, newRegistry];
    setRegistries(updated);
    saveToStorage(updated);
    toast.success("Registry added");
  };

  const handleConnect = async (id: string) => {
    const registry = registries.find((r) => r.id === id);
    if (!registry) return;

    setRegistries((prev) =>
      prev.map((r) => (r.id === id ? { ...r, loading: true } : r))
    );
    setError(undefined);

    try {
      const registryApi = new RegistryAPI({
        url: registry.url,
        username: registry.username,
        password: registry.password,
      });
      const isOnline = await registryApi.ping();

      if (!isOnline) {
        throw new Error("Could not connect to registry");
      }

      setApis((prev) => new Map(prev).set(id, registryApi));
      setRegistries((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, connected: true, loading: false } : r
        )
      );
      toast.success(`Connected to ${registry.url}`);

      await loadAllRepositories();
    } catch (err) {
      setRegistries((prev) =>
        prev.map((r) => (r.id === id ? { ...r, loading: false } : r))
      );
      setError(err instanceof Error ? err.message : "Failed to connect");
      toast.error("Connection failed");
    }
  };

  const handleDisconnect = async (id: string) => {
    setApis((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
    setRegistries((prev) =>
      prev.map((r) => (r.id === id ? { ...r, connected: false } : r))
    );

    setSelectedRepo(undefined);
    setTags([]);
    setSelectedTag(undefined);
    setManifest(null);
    setActiveTab("tags");

    toast.info("Disconnected");
  };

  const handleRemove = (id: string) => {
    const updated = registries.filter((r) => r.id !== id);
    setRegistries(updated);
    saveToStorage(updated);
    handleDisconnect(id);
    toast.info("Registry removed");
  };

  const loadAllRepositories = useCallback(async () => {
    setLoading(true);
    const allRepos: string[] = [];

    for (const [id, api] of apis.entries()) {
      const registry = registries.find((r) => r.id === id);
      if (!registry?.connected) continue;

      try {
        const catalog = await api.getCatalog();
        allRepos.push(...(catalog.repositories || []));
      } catch (err) {
        console.error(`Failed to load repos from ${registry.url}`, err);
      }
    }

    setRepositories([...new Set(allRepos)]);
    setLoading(false);
  }, [apis, registries]);

  useEffect(() => {
    if (apis.size > 0) {
      loadAllRepositories();
    } else {
      setRepositories([]);
      setSelectedRepo(undefined);
      setTags([]);
      setSelectedTag(undefined);
      setManifest(null);
    }
  }, [apis, loadAllRepositories]);

  const handleSelectRepo = async (repo: string) => {
    if (apis.size === 0) return;

    setSelectedRepo(repo);
    setSelectedTag(undefined);
    setManifest(null);
    setActiveTab("tags");
    setLoading(true);
    setError(undefined);

    try {
      for (const api of apis.values()) {
        try {
          const tagsList = await api.getTags(repo);
          setTags(tagsList.tags || []);
          setLoading(false);
          return;
        } catch {
          continue;
        }
      }
      throw new Error("Repository not found in any connected registry");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tags");
      toast.error("Failed to load tags");
      setLoading(false);
    }
  };

  const handleSelectTag = async (tag: string) => {
    if (apis.size === 0 || !selectedRepo) return;

    setSelectedTag(tag);
    setLoading(true);
    setError(undefined);

    try {
      for (const api of apis.values()) {
        try {
          const manifestData = await api.getManifest(selectedRepo, tag);
          setManifest(manifestData);
          setActiveTab("manifest");
          setLoading(false);
          return;
        } catch {
          continue;
        }
      }
      throw new Error("Manifest not found");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load manifest");
      toast.error("Failed to load manifest");
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tag: string) => {
    if (apis.size === 0 || !selectedRepo) return;

    try {
      for (const api of apis.values()) {
        try {
          const digest = await api.getManifestDigest(selectedRepo, tag);
          await api.deleteManifest(selectedRepo, digest);

          const updatedTags = tags.filter((t) => t !== tag);
          setTags(updatedTags);

          if (selectedTag === tag) {
            setSelectedTag(undefined);
            setManifest(null);
            setActiveTab("tags");
          }

          if (updatedTags.length === 0) {
            const updatedRepos = repositories.filter((r) => r !== selectedRepo);
            setRepositories(updatedRepos);
            setSelectedRepo(undefined);
            setTags([]);
            toast.info("Repository removed (no tags remaining)");
          }

          return;
        } catch {
          continue;
        }
      }
      throw new Error("Failed to delete tag");
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteRepo = async (repo: string) => {
    if (apis.size === 0) return;

    try {
      let successfullyDeleted = false;
      let lastError: Error | null = null;

      for (const api of apis.values()) {
        try {
          const repoTags = await api.getTags(repo);

          if (!repoTags.tags || repoTags.tags.length === 0) {
            const updatedRepos = repositories.filter((r) => r !== repo);
            setRepositories(updatedRepos);

            if (selectedRepo === repo) {
              setSelectedRepo(undefined);
              setTags([]);
              setSelectedTag(undefined);
              setManifest(null);
              setActiveTab("tags");
            }

            return;
          }

          let deletedCount = 0;
          for (const tag of repoTags.tags) {
            try {
              const digest = await api.getManifestDigest(repo, tag);
              await api.deleteManifest(repo, digest);
              deletedCount++;
            } catch (err) {
              console.error(`Failed to delete tag ${tag}:`, err);
              lastError = err instanceof Error ? err : new Error(String(err));
            }
          }

          if (deletedCount > 0) {
            const updatedRepos = repositories.filter((r) => r !== repo);
            setRepositories(updatedRepos);

            if (selectedRepo === repo) {
              setSelectedRepo(undefined);
              setTags([]);
              setSelectedTag(undefined);
              setManifest(null);
              setActiveTab("tags");
            }

            successfullyDeleted = true;
            if (deletedCount < repoTags.tags.length) {
              toast.warning(
                `Deleted ${deletedCount}/${repoTags.tags.length} tags`
              );
            }
            return;
          }

          throw lastError || new Error("No tags were deleted");
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          continue;
        }
      }

      if (!successfullyDeleted) {
        throw lastError || new Error("Failed to delete repository");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Delete repository error:", err);
      throw new Error(`Failed to delete repository: ${errorMsg}`);
    }
  };

  const connectedCount = registries.filter((r) => r.connected).length;
  const hasConnectedRegistries = connectedCount > 0;

  if (!hasConnectedRegistries) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 gradient-bg">
          <div className="w-full max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <motion.div
                className="flex justify-center mb-6"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="relative">
                  <Container className="w-20 h-20 text-primary" />
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome to Wharf</h2>
                <p className="text-muted-foreground">
                  Add and connect to your Docker registries to get started
                </p>
              </div>
            </motion.div>

            <Card className="p-6 glow-border glow-card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute top-0 inset-x-0 h-px glow-line"></div>
              <div className="relative space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/20">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Registries</h3>
                </div>

                <RegistryConfig onAddRegistry={handleAddRegistry} />

                {registries.length > 0 && (
                  <>
                    <Separator />
                    <RegistryList
                      registries={registries}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                      onRemove={handleRemove}
                    />
                  </>
                )}
              </div>
            </Card>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar
        connected={hasConnectedRegistries}
        registryUrl={
          connectedCount > 0
            ? `${connectedCount} ${
                connectedCount === 1 ? "registry" : "registries"
              }`
            : undefined
        }
        onDisconnect={() => {
          registries.forEach((r) => {
            if (r.connected) handleDisconnect(r.id);
          });
        }}
        registries={registries}
        onConnectRegistry={handleConnect}
        onDisconnectRegistry={handleDisconnect}
        onAddNewRegistry={() => {
          registries.forEach((r) => {
            if (r.connected) handleDisconnect(r.id);
          });
        }}
      />
      <main className="flex-1 p-4 md:p-8 gradient-bg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Registries"
              value={connectedCount}
              icon={Server}
              delay={0.1}
            />
            <StatsCard
              title="Total Repositories"
              value={repositories.length}
              icon={Database}
              delay={0.2}
            />
            <StatsCard
              title="Selected Repository"
              value={selectedRepo ? "1" : "0"}
              icon={Package}
              delay={0.3}
            />
            <StatsCard
              title="Tags"
              value={tags.length}
              icon={Tag}
              delay={0.4}
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-5 glow-border glow-card overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-px glow-line"></div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Repositories
                  </h2>
                  <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/20">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                </div>
                {loading && !selectedRepo ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <RepositoryList
                    repositories={repositories}
                    onSelectRepo={handleSelectRepo}
                    selectedRepo={selectedRepo}
                    onDeleteRepo={handleDeleteRepo}
                  />
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="md:col-span-2"
            >
              <Card className="p-5 glow-border glow-card overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-px glow-line"></div>
                {!selectedRepo ? (
                  <div className="flex items-center justify-center h-full min-h-[500px]">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center space-y-4"
                    >
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Container className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      </motion.div>
                      <div>
                        <p className="text-lg font-medium mb-2">
                          Ready to explore
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Select a repository from the list to view its tags and
                          manifests
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ) : loading && !tags.length ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : (
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="tags" className="gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </TabsTrigger>
                      <TabsTrigger value="manifest" className="gap-2">
                        <Layers className="w-4 h-4" />
                        Manifest
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tags" className="mt-0">
                      <TagsView
                        repoName={selectedRepo}
                        tags={tags}
                        onSelectTag={handleSelectTag}
                        onDeleteTag={handleDeleteTag}
                      />
                    </TabsContent>
                    <TabsContent value="manifest" className="mt-0">
                      {loading && selectedTag ? (
                        <div className="flex justify-center py-12">
                          <Spinner />
                        </div>
                      ) : manifest && selectedTag ? (
                        <ManifestView
                          manifest={manifest}
                          repoName={selectedRepo}
                          tag={selectedTag}
                        />
                      ) : (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                          <div className="text-center">
                            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Select a tag to view its manifest</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
