package com.example.mobile.viewmodels

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.mobile.models.Event
import com.example.mobile.models.NewEvent
import com.example.mobile.repositories.EventsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject


@HiltViewModel
class EventsViewModel @Inject constructor(
    private val eventsRepository: EventsRepository
) : ViewModel() {

    var eventsList by mutableStateOf<List<Event>>(emptyList())
        private set
    var selectedEvent by mutableStateOf<Event?>(null)
        private set
    var isLoading by mutableStateOf(false)
        private set
    var errorMessage by mutableStateOf<String?>(null)
        private set

    fun loadEvents() {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                eventsList = eventsRepository.getEvents()
            } catch (e: Exception) {
                errorMessage = e.message
            } finally {
                isLoading = false
            }
        }
    }

    fun loadEventDetail(id: String) {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                selectedEvent = eventsRepository.getEventDetail(id)
            } catch (e: Exception) {
                errorMessage = e.message
            } finally {
                isLoading = false
            }
        }
    }

    fun createEvent(newEvent: NewEvent, onCreated: (Event) -> Unit) {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                val created = eventsRepository.createEvent(newEvent)
                onCreated(created)
            } catch (e: Exception) {
                errorMessage = e.message
            } finally {
                isLoading = false
            }
        }
    }

    // Ajoutez d'autres fonctions (update, delete, addParticipant, etc.) selon vos besoins.
}