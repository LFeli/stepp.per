/* eslint-disable @typescript-eslint/no-empty-object-type */
import { LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  label?: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: LucideIcon
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItem {}
