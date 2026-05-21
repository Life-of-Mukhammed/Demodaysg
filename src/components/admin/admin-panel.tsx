'use client';

import { useState } from 'react';
import { Shield, BarChart3, Users, Rocket, Briefcase, GraduationCap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AdminOverview } from './admin-overview';
import { AdminUsers } from './admin-users';
import { AdminStartups } from './admin-startups';
import { AdminSpecialists } from './admin-specialists';
import { AdminMentors } from './admin-mentors';

export function AdminPanel() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-rose-500" />
        <h1 className="font-display text-4xl tracking-tight">Super Admin</h1>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-secondary/60 p-1 h-12">
          <TabsTrigger value="overview" className="gap-2 px-4">
            <BarChart3 className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2 px-4">
            <Users className="w-4 h-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="startups" className="gap-2 px-4">
            <Rocket className="w-4 h-4" /> Startups
          </TabsTrigger>
          <TabsTrigger value="specialists" className="gap-2 px-4">
            <Briefcase className="w-4 h-4" /> Specialists
          </TabsTrigger>
          <TabsTrigger value="mentors" className="gap-2 px-4">
            <GraduationCap className="w-4 h-4" /> Mentors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><AdminOverview /></TabsContent>
        <TabsContent value="users"><AdminUsers /></TabsContent>
        <TabsContent value="startups"><AdminStartups /></TabsContent>
        <TabsContent value="specialists"><AdminSpecialists /></TabsContent>
        <TabsContent value="mentors"><AdminMentors /></TabsContent>
      </Tabs>
    </div>
  );
}
