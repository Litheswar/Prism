import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, createProject, predict, whatIf, PredictPayload, PredictResponse, Project } from './api'
import { supabase } from './supabase'

export function useProjects(userId?: string){
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['projects', userId], queryFn: () => getProjects(userId) })
  useEffect(() => {
    const channel = supabase
      .channel('projects-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        ...(userId ? { filter: `user_id=eq.${userId}` } : {}),
      }, () => {
        qc.invalidateQueries({ queryKey: ['projects', userId] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId])
  return q
}

export function usePredict(payload?: PredictPayload){
  return useQuery<PredictResponse>({
    queryKey: ['predict', payload],
    queryFn: () => predict(payload || { features: {} }),
    enabled: !!payload,
  })
}

export function useWhatIf(){
  return useMutation({ mutationFn: (payload: PredictPayload) => whatIf(payload) })
}

export function useCreateProject(userId?: string){
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Project) => createProject(p, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', userId] })
    }
  })
}
