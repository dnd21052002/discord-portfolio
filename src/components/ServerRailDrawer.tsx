import { motion, AnimatePresence } from 'motion/react'
import { X } from '@phosphor-icons/react'
import { ServerRail, type ServerId } from './ServerRail'

export function ServerRailDrawer({
  isOpen,
  onClose,
  onPlay,
  activeServer,
}: {
  isOpen: boolean
  onClose: () => void
  onPlay?: () => void
  activeServer?: ServerId
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[88px] max-w-[85vw] flex-col bg-server-rail shadow-2xl lg:hidden"
            aria-label="Server list"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              type="button"
              className="absolute right-1 top-1 z-10 rounded p-1 text-text-muted transition-colors hover:bg-channel-sidebar hover:text-white"
            >
              <X size={16} weight="bold" />
            </button>

            {/* Render the same ServerRail component */}
            <div className="flex-1 overflow-y-auto pt-3">
              <ServerRail
                activeServer={activeServer ?? 'me'}
                onSelect={(id) => {
                  if (id === 'play') onPlay?.()
                  onClose()
                }}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
